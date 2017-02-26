var gulp = require('gulp'),
    bump = require('gulp-bump'),
    // https://github.com/spalger/gulp-jshint
    jshint = require('gulp-jshint'),
    githubDeploy = require('./index.js');

//--------------------------------------------------------------------------
// Tasks
//--------------------------------------------------------------------------

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
            token: '' // hide token with base64encode
        },
        repositoryUrl: '',
        branchName: 'master',
        tagName: 'v0.0.1',
        directory: 'deploy'
    }

    githubDeploy(opts);

});

// JS Hint
gulp.task('jshint', function () {
    return gulp.src(['./**/*.js', './**/*.css', './**/*.html', , '!./node_modules/**'])
        .pipe(jshint({
            esversion: 6
        }))
        .pipe(jshint.reporter('default'));
});

// https://www.npmjs.com/package/gulp-bump
// Defined method of updating - http://semver.org/
// Semantic - patch
gulp.task('bump-patch', function () {
    gulp.src(['./package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

// Semantic - minor 
gulp.task('bump-minor', function () {
    gulp.src(['./package.json'])
        .pipe(bump({
            type: 'minor'
        }))
        .pipe(gulp.dest('./'));
});

// Semantic - minor 
gulp.task('bump-major', function () {
    gulp.src(['./package.json'])
        .pipe(bump({
            type: 'major'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['deploy'], function () {
    // place code for your default task here
});