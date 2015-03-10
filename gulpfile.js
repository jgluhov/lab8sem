var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    jade = require('gulp-jade'),
    requirejs = require('gulp-requirejs'),    
    del = require('del');

// Connect
gulp.task('connect', function () {
  connect.server ({
    port: 3000, 
    livereload: true, 
    root: './public'
  }) 
})

// Styles
gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/assets/css'))
    //.pipe(notify({ message: 'Styles task complete' }))
    .pipe(connect.reload());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'))
    //.pipe(notify({ message: 'Scripts task complete' }))
    .pipe(connect.reload());
});

gulp.task('scripts', function() {
  requirejs ({
    baseUrl: "src/scripts",
    name: "../../bower_components/almond/almond",
    include: ["main"],
    insertRequire: ["main"],
    out: "main.js",
    wrap: true
  })  
  .pipe(gulp.dest('public/assets/js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest('public/assets/js'))
  .pipe(connect.reload());
})

// Jade
gulp.task('templates', function () {
  gulp.src(['src/templates/**/*.jade', '!src/templates/**/_*.jade'])        
    .pipe(jade())    
    .pipe(gulp.dest('public'))
    //.pipe(notify('Jade task complete'))
    .pipe(connect.reload());
});

// Vendor
gulp.task('vendor', function () {
  gulp.src('src/vendor/**/*.*')              
    .pipe(gulp.dest('public/assets'))    
    .pipe(connect.reload());
});

// Clean
gulp.task('clean', function(cb) {
    del(['public/assets/css', 'public/assets/js', 'public/assets/fonts'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'templates', 'connect', 'vendor', 'watch');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);  
  
  // Watch .jade files
  gulp.watch('src/templates/**/*.jade', ['templates']);
});