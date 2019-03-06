'use strict';

const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('compress', () => {
  gulp
    .src('crm_web/**')
    .pipe(zip('crm_web.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('compressSrc', () => {
  gulp
    .src('./**')
    .pipe(zip('src.zip'))
    .pipe(gulp.dest('./'));
});
