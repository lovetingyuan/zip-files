const { src, dest, series } = require('gulp')
const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')

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

exports.deploy = function (done) {
  const d = new Date
  const date = d.toLocaleString()
  exec(`git status && git commit -am "${date}" && git push`, {
    cwd: __dirname
  }, (err) => {
    if (err) return done(err)
    setTimeout(() => {
      console.log('done, see https://github.com/lovetingyuan/zip-files/deployments')
      done()
    }, 3000)
  })
}

exports.default = series([exports.clean, exports.copy, exports.deploy])
