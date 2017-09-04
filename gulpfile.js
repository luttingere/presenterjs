/**
 * Created by Eduardo Luttinger on 04/09/2017.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var jsFiles = 'src/script/*.js', jsDest = 'src/build/js/';

// gulp.task('pack-css', function () {
//     return gulp.src('src/style/css/*.css')
//         .pipe(concat('presenter.css'))
//         .pipe(gulp.dest('src/build/css/'));
// });
gulp.task('pack-less', function () {
    return gulp.src('src/style/less/*.less')
        .pipe(less())
        .pipe(concat('presenter.css'))
        .pipe(gulp.dest('src/build/css/'));
});
gulp.task('pack-js', function () {
    return gulp.src(['src/script/jquery-3.2.1.min.js','src/script/materialize.min.js','src/script/bootstrap.min.js','src/script/presenter.js'])
        .pipe(concat('presenter.js'))
        .pipe(minify())
        .pipe(gulp.dest('src/build/js/'));
});
gulp.task('default', ['pack-less', 'pack-js']);