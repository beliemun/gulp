import gulp from "gulp";
import connect from "gulp-connect";
import gulpPug from "gulp-pug";
import gulpImage from "gulp-image";
import del from "del";

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img"
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

export const clean = () => del(["build"]);

const webserver = () => {
  gulp.src("build")
  connect.server({
    root: "build",
    livereload: true,
    port: 8000
  })
  return new Promise((resolve, reject) => {
    resolve();
  })
}

const img = () =>
  gulp.src(routes.img.src)
    .pipe(gulpImage())
    .pipe(gulp.dest(routes.img.dest))
    .pipe(connect.reload());

const detectChaged = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  return new Promise((resolve, reject) => {
    resolve();
  })
}

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug]);
const postDev = gulp.series([webserver]);
const watch = gulp.series([detectChaged])

export const dev = gulp.series([prepare, assets, postDev, watch]);
