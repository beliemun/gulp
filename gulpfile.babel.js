import gulp from "gulp";
import del from "del";
import connect from "gulp-connect";
import gulpPug from "gulp-pug";
import gulpImage from "gulp-image";
import gulpSass from "gulp-sass";
import autoPreFixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import gulpBro from "gulp-bro";
import babelify from "babelify";
import phPages from "gulp-gh-pages";

gulpSass.compiler = require("node-sass");

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img"
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/styles.scss",
    dest: "build/css"
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js"
  }
};

export const pug = () =>
  gulp
    .src(routes.pug.src)
    .pipe(gulpPug())
    .pipe(gulp.dest(routes.pug.dest))
    .pipe(connect.reload());

// Task란 pug파일들은 HTML파일로 변환하거나, SCSS파일들을 CSS파일로 변환하거나,
// 이미지를 최적화하고 JS를 압축하는 등의 말하고 각 Task를 나누거나 묶어서 만들 수 있다.

export const clean = () => del(["build", ".publish"]);

const webserver = () => {
  gulp.src("build");
  connect.server({
    root: "build",
    livereload: true,
    port: 8000
  });
  return new Promise((resolve, reject) => {
    resolve();
  });
}

const img = () =>
  gulp
    .src(routes.img.src)
    .pipe(gulpImage())
    .pipe(gulp.dest(routes.img.dest))
    .pipe(connect.reload());

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(gulpSass().on("Error", gulpSass.logError))
    .pipe(autoPreFixer(["last 2 versions"]))
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest))
    .pipe(connect.reload());

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      gulpBro({
        transform: [
          babelify.configure({ presets: ['@babel/preset-env'] }),
          ['uglifyify', { global: true }]
        ]
      })
    )
    .pipe(gulp.dest(routes.js.dest))
    .pipe(connect.reload());

const gh = () => gulp.src("build/**/*").pipe(phPages());

const detectChaged = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
  return new Promise((resolve, reject) => {
    resolve();
  })
}

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles, js]);
const live = gulp.series([webserver, detectChaged]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gh, clean]);
