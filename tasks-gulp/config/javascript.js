'use strict';

let webpack = require('webpack-stream');
let named = require('vinyl-named');
let path = require('path');

let libs = [
	//Foundation dependencies
	"node_modules/jquery/dist/jquery.js",
	"node_modules/what-input/what-input.js",
	//Core foundation files
	"node_modules/foundation-sites/js/foundation.core.js",
	"node_modules/foundation-sites/js/foundation.util.*.js",
	//Foundation modules (comment out whichever you don't need
	"node_modules/foundation-sites/js/foundation.abide.js",
	"node_modules/foundation-sites/js/foundation.accordion.js",
	"node_modules/foundation-sites/js/foundation.accordionMenu.js",
	"node_modules/foundation-sites/js/foundation.drilldown.js",
	"node_modules/foundation-sites/js/foundation.dropdown.js",
	"node_modules/foundation-sites/js/foundation.dropdownMenu.js",
	"node_modules/foundation-sites/js/foundation.equalizer.js",
	"node_modules/foundation-sites/js/foundation.interchange.js",
	"node_modules/foundation-sites/js/foundation.magellan.js",
	"node_modules/foundation-sites/js/foundation.offcanvas.js",
	"node_modules/foundation-sites/js/foundation.orbit.js",
	"node_modules/foundation-sites/js/foundation.responsiveMenu.js",
	"node_modules/foundation-sites/js/foundation.responsiveToggle.js",
	"node_modules/foundation-sites/js/foundation.reveal.js",
	"node_modules/foundation-sites/js/foundation.slider.js",
	"node_modules/foundation-sites/js/foundation.sticky.js",
	"node_modules/foundation-sites/js/foundation.tabs.js",
	"node_modules/foundation-sites/js/foundation.toggler.js",
	"node_modules/foundation-sites/js/foundation.tooltip.js",
	"node_modules/motion-ui/motion-ui.js",
	//React is imported in app's own javascript and webpack just bundles that in, so no need to include it here
	//"node_modules/react/dist/react-with-addons.js",
	//"node_modules/react-dom/dist/react-dom.js"
	//Any other front-end libraries
];
//own javascript
//exclude dependencies, since they are in node_modules(if you have ES6 deps inside assets, then remove !)
let app = [
	"assets/js/**/*.*(js|jsx)",
  "!assets/js/*(dependencies|components)/**"
];

let babelConfig = {
	//https://babeljs.io/docs/usage/options/
	presets: ['es2015', 'react'],
	compact: false
};

let webpackConfig = {
	//https://github.com/shama/webpack-stream
	resolve: {
		extensions: ['', '.js', '.jsx'],      // what file extensions babel looks for in imports
		root: path.resolve(__dirname),        // absolute imports
		modulesDirectories: ['node_modules'] // where to look for modules
	},
	module: {
		loaders: [
		  {
			test: /\.jsx?$/,                  // js / jsx
			loader: 'babel?presets[]=es2015&presets[]=react',  // is handled by babel loader with es2015 support
			exclude: /node_modules/
		  }
		]
	}
};

module.exports = function(gulp, plugins, growl) {
	gulp.task('javascript:build', () => {
		//console.log('Building some fokin libraries');
		return gulp.src(libs, {base: './node_modules'})
			.pipe(named())
			.pipe(plugins.concat('libraries.js'))
			//I would hope you don't need to webpack your node_modules libraries...
			//.pipe(webpack(webpackConfig))
			.pipe(plugins.babel(babelConfig))
			.pipe(plugins.rename({ suffix: '.min' }))
			.pipe(gulp.dest('./assets/js/dependencies/'));
			//.pipe(plugins.notify({ message: 'Dependency compliation complete' }));
	});

	//app's own js is not concatenated
	gulp.task('javascript:dev', () => {
		//console.log('Building some fokin javascript');
		return gulp.src(app)
			.pipe(named())
			.pipe(webpack(webpackConfig))
      .on('error', function handleError(e) {
        console.error(`FUCK, WE GOT SOME WEBPACK ERROR!!!`);
        console.error(e);
        this.emit('end'); // Recover from errors
      })
			.pipe(gulp.dest('.tmp/public/js'))
			.pipe(plugins.notify({ message: 'ES6 javascript compliation complete' }));
	});
};
