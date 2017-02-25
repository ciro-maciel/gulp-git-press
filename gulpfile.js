var gulp = require('gulp'),
    github = require('./index.js');

//--------------------------------------------------------------------------
// Configuration
//--------------------------------------------------------------------------

var pkg = require('./package.json'),
    banner = [
        '/**',
        ' * ciro.maciel <ciro.maciel@c37.co> - in <%= new Date().toString() %>',
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
    // http://base64encode.net/
    var opts = {
        committer: {
            name: '',
            email: ''
        },
        auth: {
            userName: '',
            token: ''
        },
        repositoryUrl: '',
        branchName: 'master',
        tagName: 'v0.0.1',
        directory: 'deploy'
    }

    github(opts);

});



gulp.task('default', ['deploy'], function () {
    // place code for your default task here
});