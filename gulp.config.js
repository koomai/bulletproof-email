/*
* All gulpfile configuration options
*/

var nodemailerConfig = require('./nodemailer.config')();

module.exports = function() {
  var sourceDir = 'source';
  var localDir = 'dist/local';
  var productionDir = 'dist/production';

  var config = {
    localDir: localDir,
    productionDir: productionDir,
    sourceDir: sourceDir,
    localFiles: [
      localDir + '/css/*.css', 
      localDir + '/images/**/*', 
      localDir + '/*.html'
    ],
    sourcePath: {
      sass: sourceDir + '/stylesheets/**/*.scss',
      html: sourceDir + '/**/*.html',
      layouts: sourceDir + '/layouts/*.html',
      images: sourceDir + '/images/**/*'
    },
    browsersync: {
      port: 8080,
      open: false,
      notify: true
    },
    nodemailer: nodemailerConfig
  };
  return config;
}