module.exports = function (gulp, plugins) {
	gulp.task('buildProd', function(cb) {
		plugins.sequence(
			'compileAssets',
			'javascript:deps',
			'concat:js',
			'concat:css',
			'uglify:dist',
			'cssmin:dist',
			'linkAssetsBuildProd',
			'clean:build',
			'copy:build',
			cb
		);
	});
};
