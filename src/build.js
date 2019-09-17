
const fs = require('fs')
const browserify = require('browserify')
const terser = require('terser')

const { logError } = require('./utils')

module.exports = {
  bundle,
}

/**
 * Builds a plugin bundle JSON file from its JavaScript source.
 * 
 * @param {string} src - The source file path
 * @param {string} dest - The destination file path
 */
function bundle(src, dest) {
  return new Promise((resolve, _reject) => {

    const outStream = createWriteStream(dest)

    browserify(src)
      .plugin('sesify')
      .transform('babelify', {
        presets: ['@babel/preset-env'],
      })
      .bundle((err, bundle) => {

        if (err) writeError(err)

        outStream.end(bundle)
        // outStream.end(bundle.toString())

        // TODO: minify without minifying SES prelude
        // const { error, code } = terser.minify(bundle.toString())
        // if (error) {
        //   writeError(error.message, error, dest)
        // }
        // outStream.end(code)


        console.log(`Build success: '${src}' plugin bundled as '${dest}'`)
        resolve(true)
      })
  })
}

function createWriteStream (dest) {
  const outStream = fs.createWriteStream(dest, {
    autoClose: false,
    encoding: 'utf8',
  })
  outStream.on('error', err => {
    writeError(err.message, err, dest)
  })
  return outStream
}

function writeError(msg, err, destFilePath) {
  logError('Write error: ' + msg, err)
  fs.unlink(destFilePath, () => {})
  process.exit(1)
}
