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

var swigOpts = {
	defaults: { cache: false }
};
var bowerOpts = {
	directory: './bower_components',
	base: 'bower_components'
}
var pageSpeedOpts = {
	url: 'https://www.github.com/',
	strategy: 'mobile'
}
var srcPaths = {
	html:        ['src/templates/*.html'],
	htmlcompiled:['build/*.html'],
	scripts:     ['src/js/**/*.js'],
	less:        ['src/less/*.less'],
	images:      ['src/img/**/*'],
	fonts:       ['src/fonts/**/*'],
	assets:      ['src/assets/**/*']
};
var watchPaths = {
	bowersrc:   ['bower.json'],
	bowerbuild: ['build/lib/**/*'],
	htmlsrc:    ['src/templates/**/*.html'],
	htmlbuild:  ['build/**/*.html'],
	imgsrc:     srcPaths.images,
	imgbuild:   ['build/img/**/*'],
	scriptsrc:  srcPaths.scripts,
	scriptbuild:['build/js/**/*.js'],
	less:       ['src/less/**/*.less'],
	css:        ['build/css/**/*.css']
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
		.pipe($.size({title: 'scripts'}));
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
		.pipe($.swig(swigOpts))
		.pipe($.prettify({indentSize: 2}))
		.pipe(gulp.dest(destPaths.html));
});

gulp.task('htmlminify', function() {
	return gulp.src(srcPaths.html)		
		.pipe($.swig(swigOpts))
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
		.pipe($.size({title: 'styles'}));
});

gulp.task('checkcode', ['jshint', 'jscs', 'recess']);

gulp.task('jshint', function () {
	return gulp.src(srcPaths.scripts)
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'));
});

gulp.task('jscs', function () {
	return gulp.src(srcPaths.scripts)
		.pipe($.jscs());
});

gulp.task('recess', function () {
	return gulp.src(srcPaths.less)
		.pipe($.recess());
});

gulp.task('bower', ['bower-install', 'bower-copy']);

gulp.task('bower-install', function(callback) {
	bower.commands.install([], {}, bowerOpts)
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
	gulp.src(bowerMainFiles(), {base: bowerOpts.base})
		.pipe($.if('*.css', $.minifyCss()))
		.pipe($.if('*.js', $.uglify()))
		.pipe(gulp.dest(destPaths.lib));
	callback();
});

gulp.task('clean', function(callback) {
	del.sync(['build/**/*']);
	callback();
});

// Run PageSpeed Insights
gulp.task('pagespeed', pageSpeed.bind(null, {
	url: pageSpeedOpts.url,
	strategy: pageSpeedOpts.strategy
}));

gulp.task('watch', function() {
	$.livereload.listen();
	
	gulp.watch(watchPaths.bowersrc, ['bower']);
	gulp.watch(watchPaths.bowerbuild).on('change', $.livereload.changed);
	
	gulp.watch(watchPaths.scriptsrc, ['scripts', 'jshint', 'jscs']);
	gulp.watch(watchPaths.scriptbuild).on('change', $.livereload.changed);
	
	gulp.watch(watchPaths.less, ['less', 'recess']);
	gulp.watch(watchPaths.css).on('change', $.livereload.changed);
	
	gulp.watch(watchPaths.imgsrc, ['images']);
	gulp.watch(watchPaths.imgbuild).on('change', $.livereload.changed);
	
	gulp.watch(watchPaths.htmlsrc, ['html']);
	gulp.watch(watchPaths.htmlbuild).on('change', $.livereload.changed);
});

gulp.task('default', ['scripts', 'less', 'checkcode', 'images', 'fonts', 'assets', 'html', 'watch']);
gulp.task('prod',    ['clean', 'bower', 'scripts', 'less', 'checkcode', 'images', 'fonts', 'assets', 'htmlminify']);
