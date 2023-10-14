const gulp = require("gulp");

// //  // HTML
const fileInclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");
const webpHTML = require("gulp-webp-html");

// //  // SASS
const sass = require("gulp-sass")(require("sass"));
// Автодобавление новых файлов sass в  style.scss (gulp-sass-glob)
const sassGlob = require("gulp-sass-glob");
// autofrefixer
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const webpCss = require("gulp-webp-css");
//  //  //

// подключение лайв сервера (serverOptions- настройки сервера)
const server = require("gulp-server-livereload");
// Отчистка файла dist(чтобы при создании новых страниц сайта или удаление чего-то в src данные не оставались (не дублироваоись))
const clean = require("gulp-clean");
const fs = require("fs");

// Исходные карты
const sourceMaps = require("gulp-sourcemaps");
//

//группировка меда запросов.добавляем в sass
const groupMedia = require("gulp-group-css-media-queries");

// plumber - помогает избежать зависание сборки при ошибки. potify - нотификация на экране если произошла ошибка
// добавляем в sass
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

const webpack = require("webpack-stream");

// babel(поддержка JS в старых браузерах)
const babel = require("gulp-babel");

// ускорение работы Проекта. gulp-changed
const changed = require("gulp-changed");

//  //  //  Images
// imagemin(сжатие изображений)
const imagemin = require("gulp-imagemin");
//
const webp = require("gulp-webp");
//  //  //

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

// plumber - помогает избежать зависание сборки при ошибки. potify - нотификация на экране если произошла ошибка
// добавляем в sass

const plumberNotify = function (title) {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error <%= message error =%>",
      sound: false,
    }),
  };
};

// сохранение html
gulp.task("html:docs", function () {
  return (
    gulp
      .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
      // ускорение работы файла(html)
      .pipe(changed("./docs/"))
      .pipe(plumber(plumberNotify("HTML")))
      .pipe(fileInclude(fileIncludeSettings))
      .pipe(webpHTML())
      .pipe(htmlclean())
      .pipe(gulp.dest("./docs/"))
  );
});

// сохранение css
gulp.task("sass:docs", function () {
  return (
    gulp
      .src("./src/scss/*.scss")
      // ускорение работы файла(sass)
      .pipe(changed("./docs/css/"))
      .pipe(plumber(plumberNotify("SCSS")))
      .pipe(sourceMaps.init())
      .pipe(autoprefixer())
      // автодобавление стилей в style.scss
      .pipe(sassGlob())
      .pipe(webpCss())
      .pipe(groupMedia())
      .pipe(sass())
      .pipe(csso())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./docs/css/"))
  );
});

// webPack (JS) подключение js

gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js/"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("../webpack.config.js")))
    .pipe(gulp.dest("./docs/js/"));
});

// копирование изображений

gulp.task("images:docs", function () {
  return (
    gulp
      .src("./src/img/**/*")
      // ускорение работы файла(картинок)
      .pipe(changed("./docs/img/"))
      //
      .pipe(webp())
      .pipe(gulp.dest("./docs/img/"))
      .pipe(gulp.src("./src/img/**/*"))
      .pipe(changed("./docs/img/"))
      .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest("./docs/img/"))
  );
});

// копирование каких-то других файлов и шрифтов

gulp.task("fonts:docs", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts/"));
});

gulp.task("files:docs", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(gulp.dest("./docs/files/"));
});

//

// подключение лайв сервера (serverOptions- настройки сервера)

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("server:docs", function () {
  return gulp.src("./docs/").pipe(server(serverOptions));
});

// Отчистка файла dist(чтобы при создании новых страниц сайта или удаление чего-то в src данные не оставались (не дублироваоись))

gulp.task("clean:docs", function (done) {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ forse: true }));
  }
  done();
});

//   //////////////////
