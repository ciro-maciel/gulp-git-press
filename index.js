'use strict';

var shell = require('shelljs'),
    gutil = require('gulp-util');

var CLONE_DIR = '_gulp-github';

module.exports = function (opts) {

    if (!opts) {
        throw new gulpUtil.PluginError('gulp-github', 'No options', opts);
    }

    var committer = {
            name: opts.committer.name,
            email: opts.committer.email
        },
        auth = {
            userName: opts.auth.userName,
            token: opts.auth.token,
            password: opts.auth.password
        },
        repositoryUrl = opts.repositoryUrl,
        branchName = opts.branchName,
        directoryContents = opts.directoryContents;

    //
    // BANNER
    //
    gutil.log('==============================');
    gutil.log('CLONE/DEPLOY TO GITHUB');
    gutil.log('==============================');

    var gitVersion = shell.exec('git --version', {
        silent: true
    }).stdout;

    var workspace = CLONE_DIR;

    //
    // PARAMS
    //
    gutil.log('committer email:     ' + committer.email);
    gutil.log('committer name:      ' + committer.name);
    gutil.log('auth username:       ' + auth.userName);
    gutil.log('auth token:          ******');
    gutil.log('repository url:      ' + repositoryUrl);
    gutil.log('branch:              ' + branchName);
    gutil.log('directory to deploy: ' + directoryContents);
    gutil.log('=============================');

    //
    // BACKUP EXISTING .git
    //
    if (shell.test('-d', '.git')) {
        gutil.log('BACKUP existing .git directory');
        shell.mv('.git', '_git_BACKUP_TMP');
    }

    //
    // PRE CLEANUP
    //
    if (shell.test('-d', CLONE_DIR)) {
        gutil.log('cleaning existing clone dir');
        shell.rm('-rf', CLONE_DIR);
    }

    //
    // GIT CONFIG
    //
    shell.exec('git config --global user.name "' + committer.name + '"', {
        silent: true
    });
    shell.exec('git config --global user.email "' + committer.email + '"', {
        silent: true
    });
    shell.exec('git config --global push.default simple', {
        silent: true
    });

    //
    // INJECT CREDENTIALS INTO REPOSITORYURL
    //

        
    repositoryUrl = repositoryUrl.replace(/^https:\/\//, 'https://' + auth.userName + ':' + (auth.token || auth.password) + '@');
    var rememberedWorkDir = shell.pwd();

    //
    // CLONE
    //
    gutil.log('cloning ... please wait');

    if (shell.exec('git clone --single-branch --branch ' + branchName + ' ' + repositoryUrl + ' ' + CLONE_DIR, {
            silent: true
        }).code !== 0) {
        gutil.log('Error cloning failed. Quitting.');
        shell.exit(1);
    }

    if (shell.test('-d', directoryContents)) {
        //
        // COPY ARTIFACTS
        //
        shell.rm('-rf', workspace + '/*');
        shell.cp('-r', directoryContents + '/*', workspace + '/');

        //
        // ADD, COMMIT AND PUSH TO GITHUB
        //
        shell.cd(CLONE_DIR);

        var result = shell.exec('git status --porcelain | wc -l', {
            silent: true
        }).stdout;

        gutil.log(result);

        if (result === '0') {
            gutil.log('nothing to commit. quitting.');
        } else {
            gutil.log('changes detected. pushing changes ... please wait');
            shell.exec('git add . -A');
            shell.exec('git commit -m "deploy by gulp-github"');
            shell.exec('git push');
        }



        // var cmdStatus = shell.exec('git status --porcelain | wc -l', {
        //     silent: false
        // }, function (code, stdout, stderr) {

        //     gutil.log('xkxkxk');
        //     gutil.log('Program stderr:', stderr);

        //     if (stdout.trim() === '0') {
        //         gutil.log('nothing to commit. quitting.');
        //     } else {
        //         gutil.log('changes detected. pushing changes ... please wait');
        //         shell.exec('git add . -A');
        //         shell.exec('git commit -m "deploy by gulp-github"');
        //         shell.exec('git push');
        //     }

        //     //
        //     // POST CLEANUP
        //     //
        //     shell.cd(rememberedWorkDir);
        //     gutil.log('cleanup. deleting ' + CLONE_DIR + '... please wait');
        //     shell.rm('-rf', CLONE_DIR);

        //     //
        //     // RESTORE EXISTING .git
        //     //
        //     if (shell.test('-d', '_git_BACKUP_TMP')) {
        //         gutil.log('RESTORING existing .git directory.');
        //         shell.mv('_git_BACKUP_TMP', '.git');
        //     }

        //     gutil.log('all done.');

        //     return true;
        // });

    } else {
        gutil.log('WARN  directoryContents does not exist: ' + directoryContents);
    }

}