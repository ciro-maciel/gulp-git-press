'use strict';

// https://github.com/shelljs/shelljs
var shell = require('shelljs'),
    gutil = require('gulp-util'),
    // https://github.com/shelljs/shelljs/issues/165
    exec = require('child_process').execSync,
    // https://github.com/mathiasbynens/base64
    base64 = require('base-64');

var CLONE_DIR = '_gulp-github',
    PLUGIN_NAME = 'gulp-bump';


process.on('SIGINT', function () {
    console.log('done');
});


module.exports = function (opts) {

    if (!opts) {
        throw new gutil.PluginError(PLUGIN_NAME, 'No options foud', opts);
    }

    // as variaveis
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
        tagName = opts.tagName || null,
        directory = opts.directory;

    // o header para a mensagem
    gutil.log('==============================');
    gutil.log('DEPLOY/CLONE TO GITHUB');
    gutil.log('==============================');

    // os parametros 
    gutil.log('committer email:     ' + committer.email);
    gutil.log('committer name:      ' + committer.name);
    gutil.log('auth username:       ' + auth.userName);
    gutil.log('auth token:          ******');
    gutil.log('repository url:      ' + repositoryUrl);
    gutil.log('branch:              ' + branchName);
    if (tagName) {
        gutil.log('tag:                 ' + tagName);
    }
    gutil.log('directory to deploy: ' + directory);
    gutil.log('=============================');

    // fazemos o bakup do diretorio git existente
    if (shell.test('-d', '.git')) {
        gutil.log('BACKUP existing .git directory');
        shell.mv('.git', '_git_BACKUP_TMP');
    }

    // configuramos o git 
    shell.exec('git config --global user.name "' + committer.name + '"', {
        silent: true
    });
    shell.exec('git config --global user.email "' + committer.email + '"', {
        silent: true
    });
    shell.exec('git config --global push.default simple', {
        silent: true
    });

    // se houve um erro anterior o directory sera excluido
    if (shell.test('-d', CLONE_DIR)) {
        gutil.log('cleaning existing clone dir');
        shell.rm('-rf', CLONE_DIR);
    }

    // configuramos as credencias na url de acesso
    repositoryUrl = repositoryUrl.replace(/^https:\/\//, 'https://' + auth.userName + ':' + (base64.decode(auth.token) || auth.password) + '@');

    // salvamos o local do directory que estamos, para depois retornar
    var rememberedWorkDir = shell.pwd();


    gutil.log('cloning ... please wait');

    // https://github.com/shelljs/shelljs/issues/165
    // testes para lock 
    exec('git clone --single-branch --branch ' + branchName + ' ' + repositoryUrl + ' ' + CLONE_DIR, {
        stdio: 'inherit'
    });

    // executamos o clone do repository no directory informado
    // nao usar - aparentemente causando um lock! ;(
    // if (shell.exec('git clone --single-branch --branch ' + branchName + ' ' + repositoryUrl + ' ' + CLONE_DIR).code !== 0) {
    //     throw new gutil.PluginError(PLUGIN_NAME, 'Error cloning failed. Quitting.', opts);
    // }

    // verificamos se esta tudo ok com  o directory
    if (shell.test('-d', directory)) {

        // apagamos qualque conteudo que possa haver no CLONE_DIR
        shell.rm('-rf', CLONE_DIR + '/*');
        // e copiamos todo o conteudo do directory para CLONE_DIR
        shell.cp('-r', directory + '/*', CLONE_DIR + '/');

        // vamos para dentro de CLONE_DIR
        shell.cd(CLONE_DIR);

        // e executamos a verificacao do status
        var result = shell.exec('git status --porcelain | wc -l', {
            silent: true
        }).stdout;

        if (result === '0') {
            gutil.log('nothing to commit. quitting.');
        } else {
            // com alteracoes 
            gutil.log('changes detected. pushing changes ... please wait');
            // add em staging
            shell.exec('git add . -A', {
                silent: true
            });
            // executo o commit
            shell.exec('git commit -m "deploy by gulp-github"', {
                silent: true
            });
            // se temos um nome de uma tag
            if (tagName) {
                shell.exec('git tag ' + tagName, {
                    silent: true
                });
            }
            // executo o push para atulizacao dos commits 
            shell.exec('git push');
            // executo o push para atulizacao das tags
            shell.exec('git push --tags');
        }

        // retornamos para o directory salvo
        shell.cd(rememberedWorkDir);

        gutil.log('cleanup. deleting ' + CLONE_DIR + '... please wait');
        // e vamos excluir o directory
        shell.rm('-rf', CLONE_DIR);

        // e restaurar o directory original do git
        if (shell.test('-d', '_git_BACKUP_TMP')) {
            gutil.log('RESTORING existing .git directory.');
            shell.mv('_git_BACKUP_TMP', '.git');
        }

        gutil.log('all done.');

    } else {
        throw new gutil.PluginError(PLUGIN_NAME, 'WARN  directory does not exist: ' + directory, opts);
    }

}