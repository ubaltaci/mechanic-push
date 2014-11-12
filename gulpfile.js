var gulp = require('gulp');
var mocha = require('gulp-mocha');

var SECONDS = 1000;

// Run tests
gulp.task('test', function () {
    gulp.src('./test/**/*.js')
        .pipe(mocha({
            reporter: "list",
            timeout: 10 * SECONDS
        }));
});