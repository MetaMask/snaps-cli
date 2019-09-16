
const fs = require('fs')
const browserify = require('browserify')
const terser = require('terser')
// const uglify = require('uglify-js')

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
  fs.readFile(src, 'utf8', function(err, source) {

    if (err) {
      logError(`Build failure: could not read file '${src}'`, err)
      return
    }

    const outStream = openManifest(dest)

    browserify(src)
      .plugin('sesify')
      // .transform('babelify', {
      //   presets: ['@babel/preset-env'],
      // })
      .transform('uglifyify', { sourceMap: false })
      .bundle((err, bundle) => {

        if (err) writeError(err)

        const { error, code } = terser.minify(bundle.toString())
        if (error) {
          writeError(error.message, error, dest)
        }

        outStream.write(JSON.stringify({
          bundle: code,
          requestedPermissions: parseRequestedPermissions(source)
        }, null, 2))
        console.log(`Build success: '${src}' plugin bundled as '${dest}'`)
      })
  })
}

function openManifest (dest) {
  const outStream = fs.createWriteStream(dest, {
    autoClose: false,
    encoding: 'utf8',
  })
  outStream.on('error', err => {
    writeError(err.message, err, dest)
  })
  return outStream
}

function parseRequestedPermissions (source) {
  let requestedPermissions = source.match(
    /ethereumProvider\.[A-z0-9_\-$]+/g
  )

  if (requestedPermissions) {
    requestedPermissions = requestedPermissions.reduce(
      (acc, current) => ({ ...acc, [current.split('.')[1]]: {} }),
      {}
    )
  }
  return requestedPermissions
}

function writeError(msg, err, destFilePath) {
  logError('Write error: ' + msg, err)
  fs.unlink(destFilePath, () => {})
  process.exit(1)
}
