module.exports = function (gulp, plugins) {	
	gulp.task('build', function (cb) {
		plugins.sequence(			
			'compileAssets',
			'javascript:build',
			'linkAssetsBuild',
			'clean:build',
			'copy:build',			
			cb
		);
	});
};
