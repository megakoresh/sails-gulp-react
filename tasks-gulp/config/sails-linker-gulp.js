/**
 * Autoinsert script tags (or other filebased tags) in an html file.
 *
 * ---------------------------------------------------------------
 *
 * Automatically inject <script> tags for javascript files and <link> tags
 * for css files. Also automatically links an output file containing precompiled
 * templates using a <script> tag.
 *
 * For usage docs see (the original):
 * 		https://github.com/Zolmeister/grunt-sails-inject
 *
 */
"use strict";

class InjectionComments {
  constructor(asset){
    this['assetType'] = (typeof asset === 'string' && asset.length>0)?asset.toUpperCase():'ASSET';
    this['jade'] = this['pug'] = `//- ${this.assetType}`;
    this['slim'] = this['slm'] = `/ ${this.assetType}`;
    this['js'] = this['less'] = this['sass'] = this['scss'] = this['jsx'] = `/* ${this.assetType} */`;
    this['haml'] = `-# ${this.assetType}`;
    this['html'] = `<!--${this.assetType}-->`;
  }
}

function generateTag(targetExt, sourceExt, end, templates) {
  end = (end === true);
  templates = (templates===true);
  /*if(typeof injecting != 'string' || !injecting.match(/(scripts)|(styles)|(templates)/ig)) {
    console.error(`Linker injecting argument value '${injecting}' must be string, was ${typeof injecting}`);
    throw new ReferenceError('String value for injecting argument of sails linker must be "scripts", "styles" or "templates"');
  } else {
    injecting = injecting.toUpperCase();
  }*/
  let injectionComments;
  switch(sourceExt){
    case 'js':
      injectionComments = new InjectionComments(`${(end)? 'END ':''}${(templates)?'TEMPLATES':'SCRIPTS'}`);
      break;
    case 'css':
      injectionComments = new InjectionComments(`${(end)? 'END ':''}STYLES`);
      break;
    default:
      console.warn(`Unknown linker extension ${sourceExt}`);
  }
  //console.log(injectionComments);
  if(injectionComments instanceof InjectionComments){
    return injectionComments[targetExt];
  } else {
    return injectionComments[html];
  }
}

function generateStartTag(targetExt, sourceExt, templ){
  return generateTag(targetExt, sourceExt, false, templ);
}

function generateEndTag(targetExt, sourceExt, templ) {
  return generateTag(targetExt, sourceExt, true, templ);
}

let views = [ //support any template engine
  'views/**/*.html',
  'views/**/*.ejs',
  'views/**/*.pug',
  'views/**/*.jade',
  'views/**/*.haml',
  'views/**/*.slim',
  'views/**/*.dust'
];


function injectionConfig(input){
  let templ = (input.templ === true);
  let relative = (input.relative === true);
  let ignorepath = (typeof input.ignorepath === 'string' && input.ignorepath.length>0)?input.ignorepath:'';
  return {
    starttag: ((templ)?((targetExt, sourceExt) => generateStartTag(targetExt, sourceExt, true)):generateStartTag),
    endtag: ((templ)?((targetExt, sourceExt) => generateEndTag(targetExt, sourceExt, true)):generateEndTag),
    relative: relative,
    ignorePath: ignorepath
  }
}

module.exports = function(gulp, plugins, growl) {

  // Insert JS, CSS and template dev links into HTML files in the tmp assets folder
  gulp.task('sails-linker-gulp:devAssets', function() {
    let source = '.tmp/public/**/*.html';
    return gulp.src(source) // Read templates
      .pipe(plugins.inject(gulp.src(require('../pipeline').jsFilesToInject, {read: false}),injectionConfig({ignorepath:'.tmp/public'}))) // Link the javaScript
      .pipe(plugins.inject(gulp.src(require('../pipeline').cssFilesToInject, {read: false}),injectionConfig({ignorepath:'.tmp/public'}))) // Link styles
      .pipe(plugins.inject(gulp.src(['.tmp/public/jst*(-*).js'], {read: false}),injectionConfig({ignorepath:'.tmp/public', templ: true}))) // Link the JST Templates
      .pipe(gulp.dest('.tmp/public/')) // Write modified files...
      .pipe(plugins.if(growl, plugins.notify({ message: 'sails-linker-gulp:devAssets task complete' })));
  });

  // Insert JS, CSS and template dev links into HTML and EJS files in the views folder
  gulp.task('sails-linker-gulp:devViews', function() {
    return gulp.src(views) // Read templates
      .pipe(plugins.inject(gulp.src(require('../pipeline').jsFilesToInject, {read: false}),injectionConfig({ignorepath:'.tmp/public'}))) // Link the javaScript
      .pipe(plugins.inject(gulp.src(require('../pipeline').cssFilesToInject, {read: false}),injectionConfig({ignorepath:'.tmp/public'}))) // Link styles
      .pipe(plugins.inject(gulp.src(['.tmp/public/jst*(-*).js'], {read: false}),injectionConfig({ignorepath:'.tmp/public', templ: true}))) // Link the JST Templates
      .pipe(gulp.dest('views/')) // Write modified files...
      //.pipe(plugins.notify({ message: 'sails-linker-gulp:devViews task complete' }));
      .pipe(plugins.if(growl, plugins.notify({ message: 'sails-linker-gulp:devViews task complete' })));
  });

  // Insert relative JS, CSS and template dev links into HTML files in the tmp assets folder
  gulp.task('sails-linker-gulp:devAssetsRelative', function() {
    let source = '.tmp/public/**/*.html';
    return gulp.src(source) // Read templates
      //.pipe(debug())
      .pipe(plugins.inject(gulp.src(require('../pipeline').jsFilesToInject, {read: false}),injectionConfig({relative: true}))) // Link the javaScript
      .pipe(plugins.inject(gulp.src(require('../pipeline').cssFilesToInject, {read: false}),injectionConfig({relative:true}))) // Link styles
      .pipe(plugins.inject(gulp.src(['.tmp/public/jst*(-*).js'], {read: false}),injectionConfig({relative:true, templ: true}))) // Link the JST Templates
      .pipe(gulp.dest('.tmp/public/')) // Write modified files...
      .pipe(plugins.if(growl, plugins.notify({ message: 'sails-linker-gulp:devAssetsRelative task complete' })));
  });

  // Insert relative JS, CSS and template dev links into HTML and EJS files in the views folder
  gulp.task('sails-linker-gulp:devViewsRelative', function() {
    return gulp.src(views) // Read templates
      //.pipe(debug())
      .pipe(plugins.inject(gulp.src(require('../pipeline').jsFilesToInject, {read: false}),injectionConfig({relative: true}))) // Link the javaScript
      .pipe(plugins.inject(gulp.src(require('../pipeline').cssFilesToInject, {read: false}),injectionConfig({relative: true}))) // Link styles
      .pipe(plugins.inject(gulp.src(['.tmp/public/jst*(-*).js'], {read: false}),injectionConfig({relative: true, templ: true}))) // Link the JST Templates
      .pipe(gulp.dest('views/')) // Write modified files...
      .pipe(plugins.if(growl, plugins.notify({ message: 'sails-linker-gulp:devViewsRelative task complete' })));
  });

  // Insert JS, CSS and template production links into HTML files in the tmp assets folder
  gulp.task('sails-linker-gulp:prodAssets', function() {
    let source = '.tmp/public/**/*.html';
    return gulp.src(source) // Read templates
      //.pipe(debug())
      .pipe(plugins.inject(gulp.src(['.tmp/public/concat/production.min.js'], {read: false}),injectionConfig({ignorepath:'.tmp/public'}))) // Link the javaScript
      .pipe(plugins.inject(gulp.src(['.tmp/public/concat/production.min.css'], {read: false}),injectionConfig({ignorepath:'.tmp/public'}))) // Link styles
      .pipe(plugins.inject(gulp.src(['.tmp/public/jst*(-*).js'], {read: false}),injectionConfig({ignorepath:'.tmp/public', templ: true}))) // Link the JST Templates
      .pipe(gulp.dest('.tmp/public/')) // Write modified files...
      .pipe(plugins.if(growl, plugins.notify({ message: 'sails-linker-gulp:prodAssets task complete' })));
  });

  // Insert JS, CSS and template production links into HTML and EJS files in the views folder
  gulp.task('sails-linker-gulp:prodViews', function() {
    return gulp.src(views) // Read templates
      //.pipe(debug())
      .pipe(plugins.inject(gulp.src(['.tmp/public/concat/production.min.js'], {read: false}),injectionConfig({ignorepath:'./tmp/public'}))) // Link the javaScript
      .pipe(plugins.inject(gulp.src(['.tmp/public/concat/production.min.css'], {read: false}),injectionConfig({ignorepath:'./tmp/public'}))) // Link styles
      .pipe(plugins.inject(gulp.src(['.tmp/public/jst*(-*).js'], {read: false}),injectionConfig({ignorepath:'./tmp/public', templ: true}))) // Link the JST Templates
      .pipe(gulp.dest('views/')) // Write modified files...
      .pipe(plugins.if(growl, plugins.notify({ message: 'sails-linker-gulp:prodViews task complete' })));
  });

  // Insert relative JS, CSS and template production links into HTML files in the tmp assets folder
  gulp.task('sails-linker-gulp:prodAssetsRelative', function() {
    let source = '.tmp/public/**/*.html';
    return gulp.src(source) // Read templates
      //.pipe(debug())
      .pipe(plugins.inject(gulp.src(['.tmp/public/concat/production.min.js'], {read: false}),injectionConfig({relative:true}))) // Link the javaScript
      .pipe(plugins.inject(gulp.src(['.tmp/public/concat/production.min.css'], {read: false}),injectionConfig({relative:true}))) // Link styles
      .pipe(plugins.inject(gulp.src(['.tmp/public/jst*(-*).js'], {read: false}),injectionConfig({relative:true, templ: true}))) // Link the JST Templates
      .pipe(gulp.dest('.tmp/public/')) // Write modified files...
      .pipe(plugins.if(growl, plugins.notify({ message: 'sails-linker-gulp:prodAssetsRelative task complete' })));
  });

  // Insert relative JS, CSS and template production links into HTML and EJS files in the views folder
  gulp.task('sails-linker-gulp:prodViewsRelative', function() {
    return gulp.src(views) // Read templates
      //.pipe(debug())
      .pipe(plugins.inject(gulp.src(['.tmp/public/concat/production.min.js'], {read: false}),injectionConfig({relative: true}))) // Link the javaScript
      .pipe(plugins.inject(gulp.src(['.tmp/public/concat/production.min.css'], {read: false}),injectionConfig({relative: true}))) // Link styles
      .pipe(plugins.inject(gulp.src(['.tmp/public/jst*(-*).js'], {read: false}),injectionConfig({relative: true, templ: true}))) // Link the JST Templates
      .pipe(gulp.dest('views/')) // Write modified files...
      .pipe(plugins.if(growl, plugins.notify({ message: 'sails-linker-gulp:prodViewsRelative task complete' })));
  });

};
