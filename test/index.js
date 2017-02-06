'use strict';

var gitHub = require('..');
var assert = require('assert');

require('mocha');


var opts = {
    committer: {
        name: 'Ciro Cesar Maciel',
        email: 'ciro.maciel@c37.co'
    },
    auth: {
        userName: 'ciro.maciel',
        token: '6eacab981c36f7e92d9ab243aad70b927339d9e3'
    },
    repositoryUrl: 'https://github.com/ciro-maciel/deploy-to-github.git',
    branchName: 'master',
    directoryContents: 'build'
}


gitHub(opts);


// describe('gulp-github: test', function () {

//     gitHub(opts);

//     // assert.ok(gitHub(opts));

// })