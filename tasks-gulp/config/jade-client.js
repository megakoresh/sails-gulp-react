/**
 * Precompiles Jade templates to a `.js` file.
 *
 * ---------------------------------------------------------------
 *
 * (i.e. basically it takes HTML files and turns them into tiny little
 *  javascript functions that you pass data to and return HTML. This can
 *  speed up template rendering on the client, and reduce bandwidth usage.)
 *
 *
 */

module.exports = function(gulp, plugins, growl) {
  gulp.task('pug:dev', function() {
    return gulp.src(require('../pipeline').templateFilesToInject)
      .pipe(plugins.foreach(function(stream,file){
        var filename = file.relative;
        filename = filename.split('.')[0];
        return stream
          .pipe(plugins.rename({
            dirname: '/assets/templates/'
          }))
          .pipe(plugins.pug({
            client: true,
            name: filename,
            compileDebug: false,
            pretty: true
          }));
      }))
      .pipe(plugins.concat('jst-pug.js'))
      .pipe(gulp.dest('.tmp/public'))
      .pipe(plugins.if(growl, plugins.notify({ message: 'Pug dev task complete' })));
  });
};
