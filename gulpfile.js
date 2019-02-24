'use strict';

const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('compress', () => {
  gulp
    .src('mytel/**')
    .pipe(zip('mytel.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('compressSrc', () => {
  gulp
    .src('./**')
    .pipe(zip('src.zip'))
    .pipe(gulp.dest('./'));
});
