var gulp = require('gulp');

var clean     = require('gulp-clean');
var changed   = require('gulp-changed');
var concat    = require('gulp-concat');
var uglify    = require('gulp-uglify');
var imagemin  = require('gulp-imagemin');
var less      = require('gulp-less');
var minifycss = require('gulp-minify-css');
var livereload= require('gulp-livereload');
var watch     = require('gulp-watch');

var srcPaths = {
	scripts: ['source/js/**/*'],
	less:    ['source/less/**/*'],
	images:  ['source/img/**/*']
};

gulp.task('watch', function() {
	gulp.watch(srcPaths.scripts, ['scripts']);
	gulp.watch(srcPaths.less, ['less']);
	gulp.watch(srcPaths.images, ['images']);
});
 
gulp.task('scripts', function() {
	var dest = 'build/js';
	// Minify and copy all JavaScript
	return gulp.src(srcPaths.scripts)
		.pipe(changed(dest))
		.pipe(uglify())
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
});

gulp.task('images', function() {
	var dest = 'build/img';
	return gulp.src(srcPaths.images)
		.pipe(imagemin())
		.pipe(gulp.dest(dest));
});

gulp.task('less', function() {
	var dest = 'build/css';
	// Minify and copy all LESS
	return gulp.src(srcPaths.less)
		.pipe(changed(dest))
		.pipe(less())
		.pipe(minifycss())
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
});

gulp.task('bower', function() {
	
});

gulp.task('clean', function () {  
 	return gulp.src('build/**/*', {read: false})
		.pipe(clean());
});

gulp.task('default', ['scripts', 'less', 'images', 'watch']);
