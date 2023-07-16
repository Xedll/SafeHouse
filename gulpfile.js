// @ts-nocheck
const { src, dest, watch, parallel, series } = require('gulp');



const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer')
const clean = require('gulp-clean')
const avif = require('gulp-avif')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const svgSprite = require('gulp-svg-sprite')
const fonter = require('gulp-fonter')
const ttf2woff2 = require('gulp-ttf2woff2')
const include = require('gulp-include')

function pages() {
   return src('app/pages/*.html')
      .pipe(include({
         includePaths: 'app/components'
      }))
      .pipe(dest('app'))
      .pipe(browserSync.stream())
}



function fonts() {
   return src('app/fonts/src/*.*')
      .pipe(fonter({
         formats: ['woff', 'ttf']
      }))
      .pipe(src('app/fonts/*.ttf'))
      .pipe(ttf2woff2())
      .pipe(dest('app/fonts'))
}

function images() {
   return src(['app/images/src/*.*', '!app/images/src/*.svg'])
      .pipe(newer('app/images'))
      .pipe(avif({ quality: 50 }))

      .pipe(src(['app/images/src/*.*']))
      .pipe(newer('app/images'))
      .pipe(webp())

      .pipe(src(['app/images/src/*.*']))
      .pipe(newer('app/images'))
      .pipe(imagemin())

      .pipe(dest('app/images'))
}

function sprite() {
   return src(['app/images/*.svg', '!app/images/sprite.svg'])
      .pipe(svgSprite({
         mode: {
            stack: {
               sprite: '../sprite.svg',
               example: true,
            }
         }
      }))
      .pipe(dest('app/images'))
}

function scripts() {
   return src('app/js/dist')
      .pipe(clean())

      .pipe(src(['app/js/**/*.js', '!app/js/dist/main.min.js']))
      .pipe(concat('main.min.js'))
      .pipe(uglify())

      .pipe(dest('app/js/dist'))
      .pipe(browserSync.stream())
}

function styles() {
   return src([
      'app/scss/**/*.scss', '!app/scss/adaptive.scss'
   ])
      .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
      .pipe(src('app/scss/adaptive.scss'))
      .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }))
      .pipe(concat('style.min.css'))
      .pipe(scss({ outputStyle: 'compressed' }))

      .pipe(dest('app/css'))
      .pipe(browserSync.stream())
}

function watching() {
   browserSync.init({
      server: {
         baseDir: "app/"
      }
   });
   watch(['app/scss/**/*.scss'], styles)
   watch(['app/images/src'], series(images, sprite))
   watch(['app/pages/*', 'app/components/**/*'], pages)
   watch(['app/fonts/src/*'], fonts)
   watch(['app/js/*.js', '!app/js/main.min.js'], scripts)
}


function cleanDist() {
   return src('docs')
      .pipe(clean())
}


function building() {
   return src([
      'app/css/style.min.css',
      'app/js/dist/main.min.js',
      'app/images/*.*',
      '!app/images/*.svg',
      '!app/images/stack',
      'app/images/sprite.svg',
      'app/fonts/*.*',
      'app/*.html',
   ], { base: 'app' })
      .pipe(dest('docs'))
}



exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watching = watching;
exports.sprite = sprite;
exports.fonts = fonts;
exports.pages = pages;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, sprite, scripts, fonts, pages, watching);