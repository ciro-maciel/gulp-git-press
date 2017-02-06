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
        userName: 'ciro-maciel',
        token: '689490a71ac4f92a3c268d464f44b5824ea15a8c'
    },
    repositoryUrl: 'https://github.com/ciro-maciel/deploy-to-github.git',
    branchName: 'master',
    tagName: 'v0.0.10',
    directory: 'build'
}


gitHub(opts);

// describe('gulp-github: test', function () {
//     gitHub(opts);
// })