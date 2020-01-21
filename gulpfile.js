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
  exec(`git pull && git status && git add . && git commit -m "${date}" && git push`, {
    cwd: __dirname
  }, (err, stdout) => {
    if (err) return done(err)
    process.stdout.write(stdout + '\n')
    setTimeout(() => {
      process.stdout.write('Done, see https://github.com/lovetingyuan/zip-files/deployments\n')
      done()
    }, 2000)
  })
}

Object.keys(exports).forEach(name => {
  if (typeof exports[name] === 'function' && !exports[name].name && !exports[name].displayName) {
    exports[name].displayName = name
  }
})

exports.default = series([exports.clean, exports.copy, exports.deploy])
