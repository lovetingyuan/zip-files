const filesaver = 'https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js'
const jszip = 'https://cdn.jsdelivr.net/npm/jszip@3.2.2/dist/jszip.min.js'

function readFile ({ file, name }) {
  return new Promise((resolve) => {
    const reader = new window.FileReader()
    reader.onload = function (evt) {
      resolve([name, evt.target.result.split(',')[1]])
    }
    // Read in the image file as a data URL.
    reader.readAsDataURL(file)
  })
}

export default function zipFiles (files, zipName) {
  return Promise.all([
    window.FileSaver || window.loadScript(filesaver),
    window.JSZip || window.loadScript(jszip),
    ...Object.keys(files).map(name => readFile(files[name]))
  ]).then(contents => {
    const zip = new window.JSZip()
    contents.forEach((file) => {
      if (Array.isArray(file)) {
        zip.file(file[0], file[1], { base64: true })
      }
    })
    return zip.generateAsync({ type: 'blob' })
  }).then(blob => {
    window.saveAs(blob, zipName)
  })
}
