module.exports = function(gulp, plugins, growl){
	gulp.task('sass:dev', () => {
		return gulp.src('assets/styles/importer.scss')
      .pipe(plugins.sassGlob())
			.pipe(plugins.sass({
					includePaths: [
						"node_modules/foundation-sites/scss",
						"node_modules/motion-ui/src"
					],
					expand: true,
					ext: '.css'
				}))
			.pipe(gulp.dest('.tmp/public/styles/'))
			.pipe(plugins.if(growl, plugins.notify({
				message: 'sass dev task complete'
			})));
	});
};
