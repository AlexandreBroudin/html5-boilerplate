// import
var gulp = require('gulp')
  , rimraf = require('rimraf')
  , lr = require('tiny-lr')
  , server = lr()

var concat = require('gulp-concat')
  , plumber = require('gulp-plumber')
  //, jshint = require('gulp-jshint')
  , rework = require('gulp-rework')
  , sass = require('gulp-sass')
  , autoprefixer = require('gulp-autoprefixer')
  , browserify = require('gulp-browserify')
  , connect = require('gulp-connect')
  , livereload = require('gulp-livereload')
  , iconfont = require('gulp-iconfont')
  , iconfontCss = require('gulp-iconfont-css')
  , declare = require('gulp-declare')
  , replace = require('gulp-replace')
  , imagemin = require('gulp-imagemin')

// rework
var reworkPlugins = {
  parent: require('rework-parent'),
  importer: require('rework-importer')
}

/**
 * Tasks
 */

// server

gulp.task('server', function() {
  connect.server({
    livereload: true
  });
});

// clean
gulp.task("clean", function() {
  return rimraf.sync('dist/')
})

// assets
gulp.task('assets', function() {
  return gulp.src('src/assets/**/*')
    .pipe( gulp.dest('dist/') )
    .pipe( connect.reload() )
})

// scripts

gulp.task('scripts:head', function() {
  return gulp.src([
      "src/scripts/vendor/modernizr-2.8.0.min.js"
    ])
    .pipe( plumber() )
    .pipe( concat('head.js', { newLine: ';' } ) )
    .pipe( gulp.dest('dist/scripts/') )
    .pipe( connect.reload() )
});

gulp.task('scripts:libs', function() {
  return gulp.src([
      "src/scripts/vendor/jquery-1.11.1.min.js",
    ])
    .pipe( plumber() )
    .pipe( concat('libs.js', { newLine: ';' } ) )
    .pipe( gulp.dest('dist/scripts/') )
    .pipe( connect.reload() )
});

gulp.task('scripts', function() {
  return gulp.src([
      "src/scripts/plugin.js",
      "src/scripts/main.js",
    ])
    .pipe( plumber() )
    .pipe( concat('main.js', { newLine: ';' } ) )
    .pipe( gulp.dest('dist/scripts/') )
    .pipe( connect.reload() )
});

// check scripts
//gulp.task('jshint', function() {
//  return gulp.src( 'src/scripts/**/*' )
//    .pipe( plumber() )
//    .pipe( jshint('.jshintrc'))
//    .pipe( jshint.reporter('jshint-stylish') )
//})

// styles
gulp.task('styles:desktop', function() {
  return gulp.src([
      'node_modules/normalize.css/normalize.css',
      'src/styles/main-desktop.scss'
    ])
    .pipe(sass())
    .pipe( plumber() )
    .pipe( rework(
      reworkPlugins.importer({ path: 'src/styles/' }),
      reworkPlugins.parent,
      {
        sourcemap: true
      }
    ) )
    .pipe( autoprefixer("last 2 versions", "> 5%", "Android 4", "Firefox > 25") )
    .pipe( concat('main.css') )
    .pipe( gulp.dest('dist/styles/') )
    .pipe( connect.reload() )
})

gulp.task('styles:mobile', function() {
  return gulp.src('src/styles/main-mobile.scss')
    .pipe(sass())
    .pipe( plumber() )
    .pipe( rework(
      reworkPlugins.importer({ path: 'src/styles/' }),
      reworkPlugins.parent,
      {
        sourcemap: true
      }
    ) )
    .pipe( autoprefixer("last 2 versions", "> 5%", "Android 4", "Firefox > 25") )
    .pipe( concat('main-mobile.css') )
    .pipe( gulp.dest('dist/styles/') )
    .pipe( connect.reload() )
})


// optimise image
gulp.task('images', function() {
 return gulp.src('src/images/**/*')
    .pipe( imagemin() )
    .pipe( gulp.dest('dist/images') )
    .pipe( connect.reload() )
})

// glyphicons
gulp.task('glyphicons', function() {
 return gulp.src('src/glyphicons/**/*')
    .pipe(iconfontCss({
      fontName: 'icons',
      targetPath: '../../styles/shared/icons.css',
      fontPath: '../fonts/'
    }))
    .pipe(iconfont({
      fontName: 'icons'
     }))
    .pipe( gulp.dest('src/assets/fonts') )
})

// watch
gulp.task('watch', function () {

    gulp.watch( [ 'src/assets/**/*' ], ['assets'] )
    gulp.watch( [ 'src/scripts/**/*' ], ['scripts:head', 'scripts:libs', 'script'] )
    gulp.watch( [ 'src/styles/**/*' ], ['styles:desktop', 'styles:mobile'] )
    gulp.watch( [ 'src/images/**/*' ], ['images'] )
    gulp.watch( [ 'index.html' ] )

})

/**
 * Commands
 */

gulp.task('dev', ['clean'], function() {
  gulp.start('assets', 'glyphicons', 'styles:desktop', 'styles:mobile', 'scripts:head', 'scripts:libs', 'scripts', 'images')
})

gulp.task('default', ['dev'], function() {
  gulp.start('server')
  gulp.start('watch')
})