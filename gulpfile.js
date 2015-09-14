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
var rename = require('gulp-rename');
var argv = require('yargs').argv;
var del = require('del');
var browserSync = require('browser-sync').create();
var nodemailer = require('nodemailer');
var fs = require('fs');
// Config files
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
          open: config.browsersync.open || (argv.open || (argv.o || false)),
          notify: config.browsersync.notify
      });

    gulp.watch([config.sourcePath.sass, config.sourcePath.html], ['html']);
    gulp.watch(config.sourcePath.images, ['images:local']);

    gulp.watch(config.localFiles)
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

// Copy a template to the clipboard
// Pass a template name as an argument --template=NAME or -t NAME
gulp.task('copy', function() {
  var template = argv.template ? argv.template : (argv.t ? argv.t : null);

  if (! template) {
    return log('***ERROR***: Name of template is missing.\n', 'red');
  }
  // Copy to Clipboard
  gulp.src(config.productionDir + '/' + template + '.html')
    .pipe(clipboard());

  return log('Copied ' + gutil.colors.magenta(template + '.html') + ' to clipboard.\n');
});

// Clone a Template
gulp.task('clone', function() {

  if (! argv.from) {
    return log('***ERROR***: You need to specify a source template.\n', 'red');
  }
  if (! argv.to) {
    return log('***ERROR***: You need to specify a name for the new template.\n', 'red');
  }
  // Clone layout
  gulp.src([config.sourceDir + '/layouts/' + argv.from + '.html'])
    .pipe(rename(argv.to + '.html'))
    .pipe(replace(argv.from, argv.to))
    .pipe(gulp.dest(config.sourceDir + '/layouts/'));
  // Clone partials
  gulp.src([config.sourceDir + '/partials/' + argv.from + '/*'])
    .pipe(gulp.dest(config.sourceDir + '/partials/' + argv.to));

  return gutil.log('Cloned to ' + gutil.colors.magenta(argv.to) + ' successfully.\n');
});

// Remove a Template
gulp.task('remove', function() {
  var template = argv.template ? argv.template : (argv.t ? argv.t : null);

  if (! template) {
    return log('***ERROR***: Name of template is missing.\n', 'red');
  }
  // Delete from source directory and build directories
  del([
    config.sourceDir + '/layouts/' + template + '.html', 
    config.sourceDir + '/partials/' + template,
    config.productionDir + '/' + template + '.html', 
    config.localDir + '/' + template + '.html'
  ]);

  return log('Removed template ' + gutil.colors.magenta(template) + ' successfully.\n');
});

// Send test emails
gulp.task('mail', function() {
  var template = argv.template ? argv.template : (argv.t ? argv.t : null);

  if (! template) {
    return log('***ERROR***: Name of template is missing\n', 'red');
  }

  // Nodemailer
  var transporter = nodemailer.createTransport(config.nodemailer.transportOptions);
  var mailOptions = config.nodemailer.mailOptions;
  // Update config values
  mailOptions.to = argv.to ? argv.to : config.nodemailer.mailOptions.to;
  mailOptions.subject = argv.subject ? argv.subject : config.nodemailer.mailOptions.subject;

  // get template contents and send email
  fs.readFile(config.productionDir + '/' + template + '.html', 'utf8', function(err, data) {
    if(err) {
      handleError(err);
    }
    var regExp = /(\.\.)?\/?images\//g;
    mailOptions.html = data.replace(regExp, config.nodemailer.imageHost);

    // Send the email
    transporter.sendMail(mailOptions, function(err, info){
      if(err) {
        handleError(err);
      }
      log('Test email for template ' + gutil.colors.magenta(template) + ' sent successfully \n');
    });

  });
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
  log(err.toString(), 'red');
  this.emit('end');
}
