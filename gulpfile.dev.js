"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.build = exports.sprite = exports.styles = void 0;

var _gulp = _interopRequireDefault(require("gulp"));

var _gulpPlumber = _interopRequireDefault(require("gulp-plumber"));

var _gulpLess = _interopRequireDefault(require("gulp-less"));

var _gulpPostcss = _interopRequireDefault(require("gulp-postcss"));

var _postcssCsso = _interopRequireDefault(require("postcss-csso"));

var _gulpRename = _interopRequireDefault(require("gulp-rename"));

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

var _browserSync = _interopRequireDefault(require("browser-sync"));

var _gulpHtmlmin = _interopRequireDefault(require("gulp-htmlmin"));

var _gulpTerser = _interopRequireDefault(require("gulp-terser"));

var _gulpLibsquoosh = _interopRequireDefault(require("gulp-libsquoosh"));

var _gulpSvgmin = _interopRequireDefault(require("gulp-svgmin"));

var _gulpSvgstore = _interopRequireDefault(require("gulp-svgstore"));

var _del = _interopRequireDefault(require("del"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Styles
var styles = function styles() {
  return _gulp["default"].src('source/less/style.less', {
    sourcemaps: true
  }).pipe((0, _gulpPlumber["default"])()).pipe((0, _gulpLess["default"])()).pipe((0, _gulpPostcss["default"])([(0, _autoprefixer["default"])(), (0, _postcssCsso["default"])()])).pipe((0, _gulpRename["default"])("style.min.css")).pipe(_gulp["default"].dest('build/css', {
    sourcemaps: '.'
  })).pipe(_browserSync["default"].stream());
}; //HTML


exports.styles = styles;

var html = function html() {
  return _gulp["default"].src('source/*.html').pipe((0, _gulpHtmlmin["default"])({
    collapseWhitespace: true
  })).pipe(_gulp["default"].dest('build'));
}; //Scripts


var scripts = function scripts() {
  return _gulp["default"].src('source/js/*.js').pipe((0, _gulpTerser["default"])()).pipe(_gulp["default"].dest('build/js'));
}; //Images


var optimizeImages = function optimizeImages() {
  return _gulp["default"].src('source/img/**/*.{jpg,png}').pipe((0, _gulpLibsquoosh["default"])()).pipe(_gulp["default"].dest('build/img'));
};

var copyImages = function copyImages() {
  return _gulp["default"].src('source/img/**/*.{jpg,png}').pipe(_gulp["default"].dest('build/img'));
}; //WebP


var createWebp = function createWebp() {
  return _gulp["default"].src('source/img/**/*.{jpg,png}').pipe((0, _gulpLibsquoosh["default"])({
    webp: {}
  })).pipe(_gulp["default"].dest('build/img'));
}; //svg


var sprite = function sprite() {
  return _gulp["default"].src('source/img/**/*.svg').pipe((0, _gulpSvgmin["default"])()).pipe((0, _gulpSvgstore["default"])({
    inlineSvg: true
  })).pipe((0, _gulpRename["default"])('sprite.svg')).pipe(_gulp["default"].dest('build/img'));
}; //Copy


exports.sprite = sprite;

var copy = function copy(done) {
  _gulp["default"].src(['source/fonts/*.{woff2,woff}', 'source/*.ico', 'source/*.webmanifest'], {
    base: 'source'
  }).pipe(_gulp["default"].dest('build'));

  done();
}; // Clean


var clean = function clean() {
  return (0, _del["default"])('build');
}; // Server


var server = function server(done) {
  _browserSync["default"].init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false
  });

  done();
}; // Reload


var reload = function reload(done) {
  _browserSync["default"].reload();

  done();
}; // Watcher


var watcher = function watcher() {
  _gulp["default"].watch('source/less/**/*.less', _gulp["default"].series(styles));

  _gulp["default"].watch('source/js/script.js', _gulp["default"].series(scripts));

  _gulp["default"].watch('source/*.html', _gulp["default"].series(html, reload));
}; //build


var build = _gulp["default"].series(clean, copy, optimizeImages, _gulp["default"].parallel(styles, html, scripts, svg, sprite, createWebp));

exports.build = build;

var _default = _gulp["default"].series(clean, copy, copyImages, _gulp["default"].parallel(styles, html, scripts, svg, sprite, createWebp), _gulp["default"].series(server, watcher));

exports["default"] = _default;
