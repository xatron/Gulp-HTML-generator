var gulp            = require('gulp');
var inject          = require('gulp-inject-string');
var template        = require('gulp-template');
var data            = require('gulp-data');
var fs              = require('fs');
var path            = require('path');
var browserSync     = require('browser-sync').create();
var injectPartials  = require('gulp-inject-partials');
var strip           = require('gulp-strip-comments');
var uglify			= require('gulp-uglify');
var uglifyCSS		= require('gulp-uglifycss');
var concat			= require('gulp-concat');
var rename			= require('gulp-rename');
var sass 			= require('gulp-sass');
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

/*
 * Building HTML, taking data from settings.json and put it into the template.
 * Also injection partials (check index.html for a example).
 * Last I add a comment on the folder with "Create by" comment.
 */
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

// Make sure build:html is completed before reload.
gulp.task('build:html:watch', ['build:html'], function() {
	reload();
});

/**
 * Building javascript into the dist/js folder.
 */
gulp.task('build:js', function() {
	gulp.src('./src/js/**/*.js')
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});

/**
 * Building jQuery from the node_modules.
 */
gulp.task('build:jquery', function() {
	gulp.src('./node_modules/jquery/dist/jquery.js')
		.pipe(rename('jquery.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js/lib'));
});

// Make sure build:js is completed before reload.
gulp.task('build:js:watch', ['build:js'], function() {
	reload();
});

/*
 * Building the SASS.
 */
gulp.task('build:sass', function () {
	gulp.src('./src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.min.css'))
		.pipe(uglifyCSS())
		.pipe(gulp.dest('./dist/css'));
});

// Make sure build:js is completed before reload.
gulp.task('build:sass:watch', ['build:sass'], function() {
	reload();
});


/**
 * Gulp watch task - this builds everything and starts a server with live reload.
 */
gulp.task('watch', ['default'], function() {
	browserSync.init({
        proxy: 'kevin.dev'
    });

	gulp.watch('src/js/**/*.js', ['build:js:watch']);
	gulp.watch('src/sass/**/*.scss', ['build:sass:watch']);
	gulp.watch('src/templates/**/*.html', ['build:html:watch']);
});

/**
 * Default task (runs every build).
 */
gulp.task('default', ['build:jquery', 'build:js', 'build:sass', 'build:html']);