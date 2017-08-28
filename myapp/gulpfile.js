var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');

gulp.task('start', function () {
    nodemon({
        script: 'app.js'
        , ext: 'js html'
        , env: { 'NODE_ENV': 'development' }
    })
});

//sass naar css omzetten

gulp.task('styles', function() {
    gulp.src('public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/stylesheets/'))
});

//Watch task
gulp.task('default',function() {
    gulp.watch('./public/sass/*.scss',['styles', 'minify-css']);
});

//compress van css
gulp.task('minify-css', function() {
    return gulp.src('public/stylesheets/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/build/stylesheets/'));
});

//aparte css bestanden in 1 file
gulp.task('concat', function () {
    return gulp.src('public/stylesheets/*.css')
        .pipe(concatCss("public/style.css"))
        .pipe(gulp.dest('build/'));
});