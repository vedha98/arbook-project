var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  watch = require('gulp-watch'),
  jshint = require('gulp-jshint'),
  livereload = require('gulp-livereload'),
  _paths = ['*.js', 'client/**/*.js','config/*.js','routes/*.js'];



gulp.task('nodemon', function() {
  nodemon({
    script: 'app.js',
    env: {
      'NODE_ENV': 'development'
    }
  })
    .on('restart');
});


gulp.task('watch', function() {
  livereload.listen();
  gulp.src(_paths, {
    read: false
  })
    .pipe(watch({
      emit: 'all'
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
  watch(_paths, livereload.changed);
});


gulp.task('lint', function() {
  gulp.src(_paths)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});



gulp.task('default', ['lint', 'nodemon', 'watch']);
