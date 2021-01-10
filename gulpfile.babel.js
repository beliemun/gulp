import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import connect from "gulp-connect";

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
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

const detectChaged = () => {
  gulp.watch(routes.pug.watch, pug);
  return new Promise((resolve, reject) => {
    resolve();
  })
}

const prepare = gulp.series([clean]);
const assets = gulp.series([pug]);
const postDev = gulp.series([webserver]);
const watch = gulp.series([detectChaged])

export const dev = gulp.series([prepare, assets, postDev, watch]);
