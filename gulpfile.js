var gulp = require('gulp');
var watchify = require('gulp-watchify');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var sequence = require('run-sequence');

function configure(browserify, args) {
  return browserify(args);
}

gulp.task('watch', function() {
  return gulp.src('src/*.js')
    .pipe(watchify(configure))
    .pipe(gulp.dest('build/'));
});

gulp.task('browserify', function() {
  return gulp.src('src/index.js')
    .pipe(browserify())
    .pipe(gulp.dest('build/'));
});

gulp.task('uglify', function() {
  return gulp.src('build/*.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function(done) {
  del('build', done);
});

gulp.task('default', function (done) {
  sequence('clean', 'browserify', 'uglify', done);
});
