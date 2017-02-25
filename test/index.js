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
        token: 'OTZjMGY2ODZjZjUzOGYzNmU3YmFmZTJhNTUxODlmM2M3ZWU0MWZiNQ=='
    },
    repositoryUrl: 'https://github.com/ciro-maciel/deploy-to-github.git',
    branchName: 'master',
    tagName: 'v0.0.10',
    directory: 'build'
}

// https://www.base64encode.org/

gitHub(opts);

// describe('gulp-github: test', function () {
//     gitHub(opts);
// })