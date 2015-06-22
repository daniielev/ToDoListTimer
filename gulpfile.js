var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var uglify = require("gulp-uglify");
var jadeify = require("jadeify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var stylus = require('gulp-stylus');
var concat = require('gulp-concat-css');;
var nib = require('nib');
var minify = require('gulp-minify-css');
var jade = require("gulp-jade");

//Include browser sync
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

gulp.task("build",["js","styl","jade"]);

gulp.task("js",function(){
        return browserify({
            entries:"./app/js/app.js",
            transform:[babelify,jadeify]
            })
        .bundle()
        .pipe(source("app.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest("./public/js/"));
    });


gulp.task("styl",function(){
   return gulp.src("./app/styl/main.styl")
   .pipe(stylus({use:nib()}))
   .pipe(concat("main.css"))
   .pipe(minify())
   .pipe(gulp.dest("./public/css/"))

    });
gulp.task("jade",function(){
    return gulp.src("./app/jade/*.jade")
    .pipe(jade())
    .pipe(gulp.dest("./public/"))
    });

// Static Server
gulp.task('serve', ['jade', 'styl', 'js'], function() {

    //reload
    browserSync.init({
        server: "./public/"
    });

    gulp.watch("./app/jade/*.jade",["jade"]).on('change', reload);
    gulp.watch("./app/styl/*.styl",["styl"]).on('change', reload);
    gulp.watch("./app/js/*.js",["js"]).on('change', reload);
});

gulp.task('default', ['serve']);