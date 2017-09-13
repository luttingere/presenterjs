/**
 * Created by Eduardo Luttinger on 04/09/2017.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var jsFiles = 'src/lib/*.js', jsDest = 'src/build/js/';

gulp.task('pack-css-libraries', function () {
    return gulp.src('src/style/css/*.css')
        .pipe(concat('presenterLibraries.css'))
        .pipe(minify())
        .pipe(gulp.dest('dist/presenter/css/'));
});
gulp.task('pack-all-less', function () {
    return gulp.src('src/style/less/*.less')
        .pipe(less())
        .pipe(concat('style.example.css'))
        .pipe(minify())
        .pipe(gulp.dest('dist/presenter/css/'));
});
gulp.task('pack-presenter-less', function () {
    return gulp.src('src/style/less/presenter.less')
        .pipe(less())
        .pipe(concat('presenter.min.css'))
        .pipe(minify())
        .pipe(gulp.dest('dist/presenter/css/'));
});
gulp.task('presenterjs-libraries', function () {
    return gulp.src(['src/lib/jquery-3.2.1.min.js', 'src/lib/materialize.min.js', 'src/lib/bootstrap.min.js'])
        .pipe(concat('thirdpartylibraries.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/presenter/js/'));
});
gulp.task('presenterjs-build', function () {
    return gulp.src(['src/js/presenter.js'])
        .pipe(concat('presenter.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/presenter/js/'));
});

gulp.task('default', ['pack-all-less', 'pack-presenter-less', 'pack-css-libraries','presenterjs-libraries', 'presenterjs-build']);