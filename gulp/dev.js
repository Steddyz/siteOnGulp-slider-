const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));

const webpack = require("webpack-stream");

// babel(поддержка JS в старых браузерах)
const babel = require("gulp-babel");

// Исходные карты
const sourceMaps = require("gulp-sourcemaps");
//

// imagemin(сжатие изображений)
const imagemin = require("gulp-imagemin");
//

// ускорение работы Проекта. gulp-changed
const changed = require("gulp-changed");

// Автодобавление новых файлов sass в  style.scss (gulp-sass-glob)
const sassGlob = require("gulp-sass-glob");

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

// сохранение html
gulp.task("html:dev", function () {
  return (
    gulp
      .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
      // ускорение работы файла(html)
      .pipe(changed("./build/"), { hasChanged: changed.compareContents })
      .pipe(plumber(plumberNotify("HTML")))
      .pipe(fileInclude(fileIncludeSettings))
      .pipe(gulp.dest("./build/"))
  );
});

// сохранение css
gulp.task("sass:dev", function () {
  return (
    gulp
      .src("./src/scss/*.scss")
      // ускорение работы файла(sass)
      .pipe(changed("./build/css/"))
      .pipe(plumber(plumberNotify("SCSS")))
      .pipe(sourceMaps.init())
      // автодобавление стилей в style.scss
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./build/css/"))
  );
});

// webPack (JS) подключение js

gulp.task("js:dev", function () {
  return (
    gulp
      .src("./src/js/*.js")
      .pipe(changed("./build/js/"))
      .pipe(plumber(plumberNotify("JS")))
      // .pipe(babel())
      .pipe(webpack(require("./../webpack.config.js")))
      .pipe(gulp.dest("./build/js/"))
  );
});

// копирование изображений

gulp.task("images:dev", function () {
  return (
    gulp
      .src("./src/img/**/*")
      // ускорение работы файла(картинок)
      .pipe(changed("./build/img/"))
      // .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest("./build/img/"))
  );
});

// копирование каких-то других файлов и шрифтов

gulp.task("fonts:dev", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./build/fonts/"))
    .pipe(gulp.dest("./build/fonts/"));
});

gulp.task("files:dev", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./build/files/"))
    .pipe(gulp.dest("./build/files/"));
});

//

// подключение лайв сервера (serverOptions- настройки сервера)

const server = require("gulp-server-livereload");

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("server:dev", function () {
  return gulp.src("./build/").pipe(server(serverOptions));
});

// Отчистка файла dist(чтобы при создании новых страниц сайта или удаление чего-то в src данные не оставались (не дублироваоись))

const clean = require("gulp-clean");
const fs = require("fs");

gulp.task("clean:dev", function (done) {
  if (fs.existsSync("./build/")) {
    return gulp.src("./build/", { read: false }).pipe(clean({ forse: true }));
  }
  done();
});

//   //////////////////

// создание watch(при обновлении чего-то - сразу же будет пересборка)

gulp.task("watch:dev", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
  gulp.watch("./src/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/img/**/*", gulp.parallel("images:dev"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:dev"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:dev"));
});

// plumber - помогает избежать зависание сборки при ошибки. potify - нотификация на экране если произошла ошибка
// добавляем в sass
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

const plumberNotify = function (title) {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error <%= message error =%>",
      sound: false,
    }),
  };
};
