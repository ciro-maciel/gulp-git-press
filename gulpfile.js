var gulp = require('gulp'),
    github = require('./index.js');

//--------------------------------------------------------------------------
// Configuration
//--------------------------------------------------------------------------

var pkg = require('./package.json'),
    banner = [
        '/**',
        ' * C37 - Controller - Desktop in <%= new Date().toString() %>',
        ' *',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version <%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' *',
        ' */',
        ''
    ].join('\n');


//--------------------------------------------------------------------------
// Tasks
//--------------------------------------------------------------------------

// https://julienrenaux.fr/2014/05/25/introduction-to-gulp-js-with-practical-examples/


gulp.task('deploy', function () {

    // https://www.base64encode.org/
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

    github(opts);

});



gulp.task('default', ['deploy'], function () {
    // place code for your default task here
});