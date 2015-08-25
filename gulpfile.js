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
// var replace = require('gulp-replace'); TODO: Replace full image URLs in HTML
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
    gulp.watch(config.sourcePath.images, ['images']);

    gulp.watch(config.localFiles())
      .on('change', browserSync.reload);
});

// Build CSS files(s)
gulp.task('compile-sass', function() {
  return gulp.src('./source/stylesheets/*.scss')
     .pipe(sass())
     .pipe(gulp.dest(localDir + '/css'));
});

// Compile Layouts into HTML file(s)
gulp.task('compile-html', ['compile-sass'], function() {
  return gulp.src('./source/layouts/*.html')
      .pipe(fileinclude({
          prefix: '{{ ',
          suffix: ' }}',
          basepath: '@file'
      }))
      .pipe(gulp.dest(localDir));
});

// Inline all CSS styles
// Minify HTML (Optional argument: --minify) 
gulp.task('inline-css', ['compile-html'], function() {
  return gulp.src(localDir + '/*.html')
    .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: false,
            removeLinkTags: true
    }))
    .pipe(gulpIf(argv.minify, minifyHTML({ conditionals: true, spare: true, quotes: true})))
    .pipe(gulp.dest(productionDir));
});

// Copy Images folder and Minify for production
// Zip images folder (Optional argument --zip)
gulp.task('copy-images', function () {
  if(argv.prod || argv.production) {
    return gulp.src('./source/images/*')
      .pipe(changed(productionDir + '/images'))
      .pipe(imagemin({ progressive: true }))
      .pipe(gulp.dest(productionDir + '/images'));
  } else {
    gulp.src('./source/images/*')
      .pipe(gulp.dest(localDir + '/images'));
  }
});

// Zip all files or images only
gulp.task('zip', ['copy-images'], function () {
  if (! argv.zip) 
    return;

  if(argv.zip == 'all') {
    return gulp.src(productionDir + '/**/**')
      .pipe(zip('all_files.zip'))
      .pipe(gulp.dest(productionDir));
  } else {
    return gulp.src(productionDir + '/images/*')
      .pipe(zip('images.zip'))
      .pipe(gulp.dest(productionDir));
  }
});

// Empty distribution folders
gulp.task('clean', function () {
  del([
    productionDir + '/**/**', 
    localDir + '/**/**'
  ]);
});

// Pass argument --prod or --production for production
if (argv.prod || argv.production) {
  // Build for Production
  gulp.task('build', ['compile-sass', 'compile-html', 'inline-css', 'copy-images', 'zip']);
} else if(argv.serve) {
  // Build for Local and start webserver/livereload
  gulp.task('build', ['compile-sass', 'compile-html', 'copy-images', 'connect', 'livereload', 'watch']);
} else {
  // Default Task - Build for Local only
  gulp.task('build', ['compile-sass', 'compile-html', 'copy-images']);
}

gulp.task('default', ['build']);