module.exports = function (gulp, plugins) {
	gulp.task('compileAssets', function(cb) {
		plugins.sequence(
			'clean:dev',
			//'jst:dev',
      'pug:dev',
			'sass:dev',
			'copy:dev',
			'coffee:dev',
			'javascript:dev',
			cb
		);
	});
};
