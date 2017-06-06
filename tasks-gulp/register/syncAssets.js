module.exports = function (gulp, plugins) {
	gulp.task('syncAssets', function(cb) {
    //console.log('assets changed');
		plugins.sequence(
			'compileAssets',
			'images',
			'linkAssets',
			cb
		);
	});
};
