/**
 *
 * Frontend workflow with Gulp, Bower and Swig.
 * 
 * @author https://github.com/jaylinski
 * @source https://github.com/jaylinski/frontend-workflow
 * @license https://github.com/jaylinski/frontend-workflow#copyright-and-license
 *
 */

'use strict';

var gulp = require('gulp');
var pagespeed = require('psi');
var bower = require('bower');
var bowermainfiles = require('main-bower-files')
var $ = require('gulp-load-plugins')();

var swigopts = {
	defaults: { cache: false }
};
var srcPaths = {
	html:        ['src/templates/*.html'],
	htmlwatch:   ['src/templates/**/*.html'],
	htmlcompiled:['build/*.html'],
	scripts:     ['src/js/**/*.js'],
	less:        ['src/less/**/*.less'],
	images:      ['src/img/**/*'],
	fonts:       ['src/fonts/**/*'],
	assets:      ['src/assets/**/*']
};
var destPaths = {
	html:     'build',
	scripts:  'build/js',
	styles:   'build/css',
	images:   'build/img',
	fonts:    'build/fonts',
	assets:   'build/assets',
	lib:      'build/lib'
};
 
gulp.task('scripts', function() {
	// Minify and copy all JavaScript
	return gulp.src(srcPaths.scripts)
		.pipe($.changed(destPaths.scripts))
		.pipe($.uglify())
		.pipe($.concat('main.min.js'))
		.pipe(gulp.dest(destPaths.scripts))
		.pipe($.size({title: 'scripts'}))
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

gulp.task('fonts', function() {
	return gulp.src(srcPaths.fonts)
		.pipe($.changed(destPaths.fonts))
		.pipe(gulp.dest(destPaths.fonts));
});

gulp.task('assets', function() {
	return gulp.src(srcPaths.assets)
		.pipe($.changed(destPaths.assets))
		.pipe(gulp.dest(destPaths.assets));
});

gulp.task('html', function() {
	return gulp.src(srcPaths.html)		
		.pipe($.swig(swigopts))
		.pipe($.prettify({indentSize: 2}))
		.pipe(gulp.dest(destPaths.html))
		.pipe($.livereload());
});

gulp.task('htmlminify', function() {
	return gulp.src(srcPaths.htmlcompiled)
		.pipe($.minifyHtml())
		.pipe(gulp.dest(destPaths.html));
});

gulp.task('less', function() {
	// Minify and copy all LESS
	return gulp.src(srcPaths.less)
		.pipe($.changed(destPaths.styles))
		.pipe($.less()
			.on('error', $.util.log)
		)
		.pipe($.minifyCss())
		.pipe(gulp.dest(destPaths.styles))
		.pipe($.size({title: 'styles'}))
		.pipe($.livereload());
});

gulp.task('jshint', function () {
	return gulp.src(srcPaths.scripts)
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'));
});

gulp.task('bower', function() {
	return gulp.src(bowermainfiles(), {base: 'bower_components'})
		.pipe($.if('*.css', $.minifyCss()))
		.pipe($.if('*.js', $.uglify()))
		.pipe(gulp.dest(destPaths.lib));
});

gulp.task('clean', function () {  
 	return gulp.src('build/**/*', {read: false})
		.pipe($.clean());
});

gulp.task('watch', function() {
	gulp.watch(srcPaths.scripts, ['scripts']);
	gulp.watch(srcPaths.less, ['less']);
	gulp.watch(srcPaths.images, ['images']);
	gulp.watch(srcPaths.htmlwatch, ['html']);
});

gulp.task('default', ['scripts', 'jshint', 'images', 'less',  'fonts', 'assets', 'html', 'watch']);
gulp.task('prod',    ['clean', 'bower', 'scripts', 'jshint', 'less', 'images', 'fonts', 'assets', 'html', 'htmlminify']);
