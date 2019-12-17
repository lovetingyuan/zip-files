const { src, dest, series } = require('gulp')
const path = require('path')
const fs = require('fs')

exports.clean = function (done) {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'gulpfile.js') return
    if (/\S+?\.[0-9a-z]{8}\.\S+$/.test(file)) {
      fs.unlinkSync(path.join(__dirname, file))
    }
  })
  done()
}

exports.copy = function () {
  return src([
    'dist/**/*',
    // '!dist/favicon.ico',
    // '!dist/icon.png',
    '!dist/**/*.map'
  ]).pipe(dest('./'))
}

exports.default = series([exports.clean, exports.copy])
