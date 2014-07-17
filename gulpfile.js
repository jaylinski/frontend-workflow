/**
 *
 *  Frontend Workfow
 *
 *  Licensed under the MIT License
 *
 */

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var pagespeed = require('psi');
var bower = require('bower');

var swigopts = {
	defaults: { cache: false }
};
var srcPaths = {
	html:        ['src/templates/*.html'],
	htmlwatch:   ['src/templates/**/*.html'],
	htmlcompiled:['build/*.html'],
	scripts:     ['src/js/**/*.js'],
	less:        ['src/less/**/*.less'],
	images:      ['src/img/**/*']
};
var destPaths = {
	html:     'build',
	scripts:  'build/js',
	styles:   'build/css',
	images:   'build/img'
};
 
gulp.task('scripts', function() {
	// Minify and copy all JavaScript
	return gulp.src(srcPaths.scripts)
		.pipe($.changed(destPaths.scripts))
		.pipe($.uglify())
		.pipe($.concat('all.min.js'))
		.pipe(gulp.dest(destPaths.scripts))
		.pipe($.livereload());
});

gulp.task('images', function() {
	return gulp.src(srcPaths.images)
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest(destPaths.images))
		.pipe($.size({title: 'images'}));
});

gulp.task('html', function() {
	return gulp.src(srcPaths.html)
		.pipe($.changed(destPaths.html))
		.pipe($.swig(swigopts))		
		.pipe(gulp.dest(destPaths.html))
		.pipe($.livereload());
});

gulp.task('htmlminify', function() {
	return gulp.src(srcPaths.htmlcomp)
		.pipe($.minifyHtml())
		.pipe(gulp.dest(destPaths.html));
});

gulp.task('less', function() {
	// Minify and copy all LESS
	return gulp.src(srcPaths.less)
		.pipe($.changed(destPaths.styles))
		.pipe($.less())
		.pipe($.minifyCss())
		.pipe($.concat('all.min.css'))
		.pipe(gulp.dest(destPaths.styles))
		.pipe($.livereload());
});

gulp.task('jshint', function () {
	return gulp.src(srcPaths.scripts)
		.pipe($.jshint());
});

gulp.task('watch', function() {
	gulp.watch(srcPaths.scripts, ['scripts']);
	gulp.watch(srcPaths.less, ['less']);
	gulp.watch(srcPaths.images, ['images']);
	gulp.watch(srcPaths.htmlwatch, ['html']);
});

gulp.task('bower', function() {
	console.log("[bower] Executing update...");
	bower.commands.update().on("end", function(results) {
		if(Object.getOwnPropertyNames(results).length === 0) {
			console.log("[bower] Everything up-to-date");
		} else {
			console.log(results);
		}		
		bower.commands.list({paths: true}).on("end", function(results) {
			console.log("[bower] Copying main files...");
			console.log(results);
		});
	});	
});

gulp.task('clean', function () {  
 	return gulp.src('build/**/*', {read: false})
		.pipe($.clean());
});

gulp.task('default', ['scripts', 'jshint', 'less', 'images', 'html', 'watch']);
gulp.task('prod',    ['clean', 'scripts', 'jshint', 'less', 'images', 'html', 'htmlminify']);
