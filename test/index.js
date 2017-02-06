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
        token: 'b79e2ac9b3008d00429fb0750e0b10aacc32aa71'
    },
    repositoryUrl: 'https://github.com/ciro-maciel/deploy-to-github.git',
    branchName: 'master',
    directoryContents: 'build'
}


describe('gulp-github: test', function () {

    assert.ok(gitHub(opts));

})