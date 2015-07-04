'use strict';

var gulp   			= require('gulp'),
		concat 			= require('gulp-concat'),
		uglify 			= require('gulp-uglify'),
		uglifycss		= require('gulp-uglifycss'),
		rename 			= require('gulp-rename'),
		sass   			= require('gulp-sass'),
		maps        = require('gulp-sourcemaps'),
		jade				= require('gulp-jade'),
		browserSync = require('browser-sync').create();

gulp.task('concatScripts', function(){
	return gulp.src([
		'src/js/jquery-1.11.3.min.js',
		'src/js/*.js'
		])
		 	.pipe(maps.init())
		 	.pipe(concat('script.js'))
		 	.pipe(maps.write('./'))
		 	.pipe(gulp.dest('js'));
	});

gulp.task('minifyScripts', ['concatScripts'], function(){
	return gulp.src('dist/js/script.js')
			.pipe(uglify())
			.pipe(rename('script.min.js'))
			.pipe(gulp.dest('js'))
			.pipe(browserSync.stream());
	});

gulp.task('compileSass', function(){
	return gulp.src('src/scss/main.scss')
			.pipe(maps.init())
			.pipe(sass())
			.pipe(rename('styles.css'))
			.pipe(maps.write('./'))
			.pipe(gulp.dest('css'));
	});

gulp.task('uglifycss', ['compileSass'], function(){
	return gulp.src('dist/css/styles.css')
			 .pipe(uglifycss())
			 .pipe(rename('styles.min.css'))
			 .pipe(gulp.dest('css'))
			 .pipe(browserSync.stream());
	});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};
 
  gulp.src('src/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('build', ['minifyScripts', 'compileSass']);

gulp.task('serve', ['uglifycss', 'minifyScripts', 'templates'], function(){
	browserSync.init({
		server: './'
		});
	gulp.watch('src/scss/**/*.scss', ['compileSass']);
	gulp.watch('src/js/*.js', ['minifyScripts']);
	gulp.watch('src/index.jade', ['templates']);
	});

gulp.task('default', ['build']);