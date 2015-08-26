/*
* All gulpfile configuration options
*/

module.exports = function() {
  var config = {
    localDir: 'dist/local',
    productionDir: 'dist/production',
    localFiles: function() {
      return [this.localDir + '/css/*.css', this.localDir + '/images/**/*', this.localDir + '/*.html']
    },
    sourcePath: {
      sass: 'source/stylesheets/**/*.scss',
      html: 'source/**/*.html',
      layouts: 'source/layouts/*.html',
      images: 'source/images/**/*'
    },
    browsersync: {
      port: 8080,
      open: false,
      notify: true
    }
  };
  return config;
}