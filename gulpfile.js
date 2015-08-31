// Gulp packages
var gulp = require('gulp');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var inlineCss = require('gulp-inline-css');
var minifyHTML = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
var zip = require('gulp-zip');
var gulpIf = require('gulp-if');
var changed = require('gulp-changed');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var clipboard = require('gulp-clipboard');
var argv = require('yargs').argv;
var del = require('del');
var browserSync = require('browser-sync').create();
// Config file
var config = require('./gulp.config')();

// Local web server (Default localhost:8080)
// Pass argument --port=XXXX to change
gulp.task('connect', ['html'], function() {
  browserSync.init({
          // Serve files from the local directory
          server: {
              baseDir: config.localDir,
              directory: true
          },
          port: argv.port ? argv.port : config.browsersync.port,
          open: config.browsersync.open || (argv.open || false),
          notify: config.browsersync.notify
      });

    gulp.watch([config.sourcePath.sass, config.sourcePath.html], ['html']);
    gulp.watch(config.sourcePath.images, ['images:local']);

    gulp.watch(config.localFiles())
      .on('change', browserSync.reload);
});

// Build CSS files
gulp.task('sass', function() {
  log('Compiling SASS to CSS');
  return gulp.src('source/stylesheets/*.scss')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sass())
    .pipe(gulp.dest(config.localDir + '/css'));
});

// Compile Layouts into HTML files
gulp.task('html', ['sass'], function() {
  log('Compiling HTML Templates');
  return gulp.src(config.sourcePath.layouts)
      .pipe(fileinclude({
          prefix: '{{ ',
          suffix: ' }}',
          basepath: '@file'
      }))
      .pipe(gulp.dest(config.localDir));
});

// Inline all CSS styles
// Minify HTML (Optional argument: --minify) 
gulp.task('inline-css', ['html'], function() {
  log('Moving CSS inline');
  return gulp.src(config.localDir + '/*.html')
    .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: false,
            removeLinkTags: true
    }))
    .pipe(gulpIf(argv.minify, minifyHTML({ conditionals: true, spare: true, quotes: true})))
    .pipe(gulp.dest(config.productionDir));
});

// Copy Images folder
gulp.task('images:local', function () {
  log('Copying images');
  gulp.src(config.sourcePath.images)
    .pipe(gulp.dest(config.localDir + '/images'));
});

// Copy Images folder and Minify for production
gulp.task('images:production', function () {
  log('Minifying and Copying images');
  return gulp.src(config.sourcePath.images)
    .pipe(changed(config.productionDir + '/images'))
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest(config.productionDir + '/images'));
});

// Zip all files or images only
gulp.task('zip', ['images:production'], function () {
  if (! argv.zip) 
    return;
  log('Compressing images into zip file');
  if(argv.zip == 'all') {
    return gulp.src(config.productionDir + '/**/**')
      .pipe(zip('all_files.zip'))
      .pipe(gulp.dest(config.productionDir));
  } else {
    return gulp.src(config.productionDir + '/images/**/*')
      .pipe(zip('images.zip'))
      .pipe(gulp.dest(config.productionDir));
  }
});

// Empty distribution folders
gulp.task('clean', function () {
  log('Cleaning up generated files');
  del([
    config.productionDir + '/**/**', 
    config.localDir + '/**/**'
  ]);
});

/* Tasks */
// Build for local and start browsersync server
gulp.task('serve', ['sass', 'html', 'images:local', 'connect']);

// Build for Production
gulp.task('build', ['sass', 'html', 'inline-css', 'images:production', 'zip']);

// Default
gulp.task('default', ['serve']);

/* Global functions */
// Injects custom messages into stream
function log(msg, color) {
  var msgColor = color ? gutil.colors[color] : gutil.colors.blue;
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if(msg.hasOwnProperty(item)) {
        gutil.log(msgColor(msg[item]));
      }
    }
  } else {
    gutil.log(msgColor(msg));
  }
}
// Handles error without breaking stream
function handleError(err) {
  gutil.beep();
  console.log(err.toString());
  this.emit('end');
}
