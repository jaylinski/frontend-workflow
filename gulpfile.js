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
var pageSpeed = require('psi');
var bower = require('bower');
var bowerMainFiles = require('main-bower-files')
var del = require('del');
var $ = require('gulp-load-plugins')();
var config = require('./gulpconfig.json');

gulp.task('root', function() {
	return gulp.src(config.srcPaths.root)
		.pipe(gulp.dest(config.destPaths.root));
});

gulp.task('scripts', function() {
	// Minify and copy all JavaScript
	return gulp.src(config.srcPaths.scripts)
		.pipe($.changed(config.destPaths.scripts))
		.pipe($.uglify())
		.pipe($.concat('main.min.js'))
		.pipe(gulp.dest(config.destPaths.scripts))
		.pipe($.size({title: 'scripts'}));
});

gulp.task('images', function() {
	return gulp.src(config.srcPaths.images)
		.pipe($.changed(config.destPaths.images))
		.pipe($.imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(config.destPaths.images))
		.pipe($.size({title: 'images'}));
});

gulp.task('fonts', function() {
	return gulp.src(config.srcPaths.fonts)
		.pipe($.changed(config.destPaths.fonts))
		.pipe(gulp.dest(config.destPaths.fonts));
});

gulp.task('assets', function() {
	return gulp.src(config.srcPaths.assets)
		.pipe($.changed(config.destPaths.assets))
		.pipe(gulp.dest(config.destPaths.assets));
});

gulp.task('html', function() {
	return gulp.src(config.srcPaths.html)		
		.pipe($.swig(config.swigOpts))
		.pipe($.prettify({indentSize: 2}))
		.pipe(gulp.dest(config.destPaths.root));
});

gulp.task('htmlminify', function() {
	return gulp.src(config.srcPaths.html)		
		.pipe($.swig(config.swigOpts))
		.pipe($.minifyHtml(config.htmlMinifyOpts))
		.pipe(gulp.dest(config.destPaths.root));
});

gulp.task('less', function() {
	// Minify and copy all LESS
	return gulp.src(config.srcPaths.less)
		.pipe($.changed(config.destPaths.styles))
		.pipe($.less()
			.on('error', $.util.log)
		)
		.pipe($.minifyCss())
		.pipe(gulp.dest(config.destPaths.styles))
		.pipe($.size({title: 'styles'}));
});

gulp.task('checkcode', ['jshint', 'jscs', 'recess']);

gulp.task('jshint', function () {
	return gulp.src(config.srcPaths.scripts)
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'));
});

gulp.task('jscs', function () {
	return gulp.src(config.srcPaths.scripts)
		.pipe($.jscs());
});

gulp.task('recess', function () {
	return gulp.src(config.srcPaths.less)
		.pipe($.recess())
		.pipe($.recess.reporter());
});

gulp.task('bower', ['bower-install', 'bower-copy']);

gulp.task('bower-install', function(callback) {
	bower.commands.install([], {}, config.bowerOpts)
		.on('log', function(result) {
			$.util.log(['bower', $.util.colors.cyan(result.id), result.message].join(' '));
		})
		.on('error', function(error) {
			$.util.log(error);
			callback();
		})
		.on('end', function() {
			callback();
		});
});

gulp.task('bower-copy', ['bower-install'], function(callback) {
	gulp.src(bowerMainFiles(), {base: config.bowerOpts.base})
		.pipe($.if('*.css', $.minifyCss()))
		.pipe($.if('*.js', $.uglify()))
		.pipe(gulp.dest(config.destPaths.lib));
	callback();
});

gulp.task('clean', function(callback) {
	del.sync(config.srcPaths.clean);
	callback();
});

// Run PageSpeed Insights
gulp.task('pagespeed', pageSpeed.bind(null, {
	url: config.pageSpeedOpts.url,
	strategy: config.pageSpeedOpts.strategy
}));

gulp.task('watch', function() {
	$.livereload.listen();
	
	gulp.watch(config.watchPaths.rootsrc, ['root']);
	gulp.watch(config.watchPaths.rootbuild).on('change', $.livereload.changed);
	
	gulp.watch(config.watchPaths.bowersrc, ['bower']);
	gulp.watch(config.watchPaths.bowerbuild).on('change', $.livereload.changed);
	
	gulp.watch(config.watchPaths.scriptsrc, ['scripts', 'jshint', 'jscs']);
	gulp.watch(config.watchPaths.scriptbuild).on('change', $.livereload.changed);
	
	gulp.watch(config.watchPaths.less, ['less', 'recess']);
	gulp.watch(config.watchPaths.css).on('change', $.livereload.changed);
	
	gulp.watch(config.watchPaths.imgsrc, ['images']);
	gulp.watch(config.watchPaths.imgbuild).on('change', $.livereload.changed);
	
	gulp.watch(config.watchPaths.htmlsrc, ['html']);
	gulp.watch(config.watchPaths.htmlbuild).on('change', $.livereload.changed);
});

gulp.task('default', ['root', 'scripts', 'less', 'checkcode', 'images', 'fonts', 'assets', 'html', 'watch']);
gulp.task('prod',    ['clean', 'bower', 'root', 'scripts', 'less', 'checkcode', 'images', 'fonts', 'assets', 'htmlminify']);
