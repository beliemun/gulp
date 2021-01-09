import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";

const routes = {
  pug: {
    src: "src/*.pug",
    dest: "build",
  },
};

export const pug = () =>
  gulp
    .src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));

// Task란 pug파일들은 HTML파일로 변환하거나, SCSS파일들을 CSS파일로 변환하거나,
// 이미지를 최적화하고 JS를 압축하는 등의 말하고 각 Task를 나누거나 묶어서 만들 수 있다.

export const clean = () => del(["build"]);

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);

export const dev = gulp.series([prepare, assets]);
