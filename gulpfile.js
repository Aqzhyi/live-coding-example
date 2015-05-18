'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var notifier = require('node-notifier');

gulp.task('jade', jadeTask);
gulp.task('less', lessTask);
gulp.task('babel', babelTask);
gulp.task('server', startDevServer);
gulp.task('clean', cleanTask);

function babelTask() {
  var stream = gulp.src('./src/**/*.js')
  .pipe(plugins.babel())
  .pipe(plugins.wrap('~function(){<%=contents%>}();'))
  .pipe(gulp.dest('./dist'))
  .pipe(plugins.connect.reload());

  return stream;
}

function lessTask() {
  var stream = gulp.src('./src/**/*.less')
  .pipe(plugins.less())
  .pipe(gulp.dest('./dist'))
  .pipe(plugins.connect.reload());

  return stream;
}

function jadeTask() {
  var stream = gulp.src('./src/index.jade')
  .pipe(plugins.jade())
  .pipe(gulp.dest('./dist'))
  .pipe(plugins.connect.reload());

  return stream;
}

function startDevServer() {

  jadeTask();
  lessTask();
  babelTask();

  gulp.watch('./src/index.jade', ['jade']);
  gulp.watch('./src/**/*.less', ['less']);
  gulp.watch('./src/**/*.js', ['babel']);

  plugins.connect.server({
    root: [
      path.join(__dirname, 'dist'),
    ],
    port: 3000,
    livereload: {
      port: ~~(Math.random() * (40000 - 10000 + 1) + 10000)
    }
  });

  notifier.notify({
    title: 'server started!',
    message: 'server started!',
  });
}

function cleanTask(done) {
  del([
    './index.html',
    './dist/assets',
  ], done);
}
