const { src, dest } = require('gulp')

exports.default = function () {
  return src(['dist/**/*'])
    .pipe(dest('./'))
}
