var gulp            = require('gulp');
var inject          = require('gulp-inject-string');
var template        = require('gulp-template');
var data            = require('gulp-data');
var fs              = require('fs');
var path            = require('path');
var browserSync     = require('browser-sync').create();
var injectPartials  = require('gulp-inject-partials');
var strip           = require('gulp-strip-comments');
var reload          = browserSync.reload;
var settings        = null;

/**
 * Read in the settings
 */
fs.readFile('./settings.json', function(err, data) {
	if(err) throw err;

	settings = JSON.parse(data);

	return settings;
});

//Gulp tasks
gulp.task('build:html', function() {
	gulp.src('src/templates/index.html')
		.pipe(injectPartials())
		.pipe(data(function() {
			return settings;
		}))
		.pipe(template())
		.pipe(strip())
		.pipe(inject.append('\n<!-- Created: ' + Date() + ' By Traizers @ Fiverr -->'))
		.pipe(gulp.dest('dist'));
});

gulp.task('build:html:watch', ['build:html'], function() {
	reload();
});

gulp.task('watch', ['build:html'], function() {
	browserSync.init({
        proxy: 'kevin.dev'
    });

	gulp.watch('src/templates/**/*.html', ['build:html:watch']);
});

gulp.task('default', ['build:html']);