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
        cloneUrl = opts.cloneUrl,
        branchName = opts.branchName,
        // subDirectory = opts.subDirectory,
        directoryContents = opts.directoryContents;

    //
    // BANNER
    //
    gutil.log('==============================');
    gutil.log('DEPLOY TO GITHUB');
    gutil.log('==============================');

    var gitVersion = shell.exec('git --version', {
        silent: true
    }).stdout;

    var workspace = CLONE_DIR;

    // if (subDirectory !== undefined && subDirectory !== null) {
    //     workspace = CLONE_DIR + '/' + subDirectory;
    // }

    //
    // PARAMS
    //
    gutil.log('git version:           ' + gitVersion.trim());
    gutil.log('git committer email:   ' + committer.email);
    gutil.log('git committer name:    ' + committer.name);
    gutil.log('git auth username:     ' + auth.userName);
    gutil.log('git auth token:        ******');
    gutil.log('git clone url:         ' + cloneUrl);
    gutil.log('git branch:            ' + branchName);
    // if (subDirectory !== undefined && subDirectory !== null) {
    //     gutil.log('git subdirectory:      ' + subDirectory);
    // }
    gutil.log('source to deploy:      ' + directoryContents);
    gutil.log('workspace:             ' + workspace);
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
    // INJECT CREDENTIALS INTO CLONEURL
    //
    cloneUrl = cloneUrl.replace(/^https:\/\//, 'https://' + auth.userName + ':' + (auth.token || auth.password) + '@');
    var rememberedWorkDir = shell.pwd();


    //
    // CLONE
    //
    gutil.log('cloning ... please wait');

    if (shell.exec('git clone --single-branch --branch ' + branchName + ' ' + cloneUrl + ' ' + CLONE_DIR).code !== 0){
        gutil.log('Error cloning failed. Quitting.');
        shell.exit(1);
    }

    gutil.log(gitClone);


    // if (subDirectory !== undefined && subDirectory !== null) {
    //     if (!shell.test('-d', CLONE_DIR + '/' + subDirectory)) {
    //         shell.mkdir(CLONE_DIR + '/' + subDirectory);
    //     }
    // }

    if (shell.test('-d', directoryContents)) {
        //
        // COPY BUILD ARTIFACTS
        //
        shell.rm('-rf', workspace + '/*');
        shell.cp('-r', directoryContents + '/*', workspace + '/');
        // copy hidden files as well
        shell.cp('-r', directoryContents + '/.*', workspace + '/');

        //
        // ADD, COMMIT AND PUSH TO GH-PAGES
        //
        shell.cd(CLONE_DIR);
        shell.exec('git status --porcelain | wc -l', {
            silent: true
        }, function (code, stdout, stderr) {
            if (stdout.trim() === '0') {
                gutil.log('nothing to commit. quitting.');
            } else {
                gutil.log('changes detected. pushing changes ... please wait');
                shell.exec('git add . -A');
                shell.exec('git commit -m "deploy by gulp-github"');
                shell.exec('git push');
            }

            //
            // POST CLEANUP
            //
            shell.cd(rememberedWorkDir);
            gutil.log('cleanup. deleting ' + CLONE_DIR + '... please wait');
            shell.rm('-rf', CLONE_DIR);

            //
            // RESTORE EXISTING .git
            //
            if (shell.test('-d', '_git_BACKUP_TMP')) {
                gutil.log('RESTORING existing .git directory.');
                shell.mv('_git_BACKUP_TMP', '.git');
            }

            gutil.log('all done.');
        });
    } else {
        gutil.log('WARN  directoryContents does not exist: ' + directoryContents);
    }

}