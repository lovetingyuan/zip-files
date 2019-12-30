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

exports.gitpush = function (done) {
  const { execSync } = require('child_process')
  const d = new Date
  const date = d.toLocaleString()
  execSync(`git status && git commit -am "${date}" && git push && npx open-cli https://github.com/lovetingyuan/zip-files/deployments`, {
    cwd: __dirname
  }, done)
}

exports.default = series([exports.clean, exports.copy])
