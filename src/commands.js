
const fs = require('fs')
const pathUtils = require('path')
const chokidar = require('chokidar')
const http = require('http')
const serveHandler = require('serve-handler')

const { bundle } = require('./build')
const {
  getOutfilePath, isDirectory, validatePaths
} = require('./utils')

module.exports = {
  build,
  serve,
  watch,
}

// build

/**
 * Builds the given file or all files in the given directory.
 */
function build (argv) {
  // validate and catch
  validatePaths(argv)
  .then((paths) => {
    buildFiles(paths)
  })
  .catch(err => {
    logError(`Build failed: ${err.message}`, err)
    process.exit(1)
  })
}

/**
 * Builds all files in the given source directory to the given destination
 * directory.
 * 
 * @param {object} pathInfo - Path information object from validatePaths
 */
function buildFiles(pathInfo) {

  const { src, dest } = pathInfo

  if (!src.isDirectory) {
    if (!src.path.endsWith('.js')) {
      throw new Error(`Invalid params: input file must be a '.js' file.`)
    }
    bundle(src.path, dest.path)
  } else {

    fs.readdir(src.path, { withFileTypes: true }, (err, files) => {

      if (err) throw err
      if (!files || files.length === 0) {
        throw new Error('Invalid directory: Source directory is empty.')
      }

      let hasSourceFiles = false

      files.forEach(file => {
        if (file.isFile() && file.name.endsWith('.js')) {
          hasSourceFiles = true
          bundle(
            pathUtils.join(src.path, file.name), getOutfilePath(file.name, dest.path)
          )
        }
      })

      if (!hasSourceFiles) throw new Error(
        'Invalid directory: Source directory contains no valid source files.'
      )
    })
  }
}

// watch

/**
 * Watches file(s) and builds them on changes.
 */
function watch (argv) {
  validatePaths(argv)
  .then((paths) => {
    watchFiles(paths)
  })
  .catch(err => {
    logError(`Watch failed: ${err.message}`, err)
    process.exit(1)
  })
}

/**
 * Watch a single file or directory for changes, and build when files are
 * added or changed. Does not watch subdirectories.
 * 
 * @param {object} pathInfo - Path information object from validatePaths
 */
function watchFiles(pathInfo) {

  const { src, dest } = pathInfo

  const watcher = chokidar.watch(src.path, {
    ignored: str => str !== src.path && !str.endsWith('.js'),
    depth: 1,
  })

  watcher
    .on('add', path => {
      console.log(`File added: ${path}`)
      bundle(path, getOutfilePath(path, dest.path))
    })
    .on('change', path => {
      console.log(`File changed: ${path}`)
      bundle(path, getOutfilePath(path, dest.path))
    })
    .on('unlink', path => console.log(`File removed: ${path}`))
    .on('error', err => {
      logError('Watch error: ' + err.message)
    })

  watcher.add(`${src.path}/*`)
  console.log(`Watching '${src.path}' for changes...`)
}

// serve

/**
 * Starts a local, static HTTP server on the given port with the given root
 * directory.
 * 
 * @param {object} argv - Argv object from yargs
 * @param {string} argv.root - The root directory path string
 * @param {number} argv.port - The server port
 */
async function serve (argv) {

  const { port, root } = argv

  const isDir = await isDirectory(root)
  if (!isDir) {
    throw new Error (`Invalid params: 'root' must be a directory.`)
  }

  const server = http.createServer(async (req, res) => {
    await serveHandler(req, res, {
      public: root,
    })
  })

  server.listen({ port }, () => {
    console.log(`Server listening on: http://localhost:${port}`)
  })

  server.on('request', (request) => {
    console.log(`Handling incoming request for: ${request.url}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logError(`Server error: Port ${port} already in use.`)
    } else {
      logError('Server error: ' + err.message, err)
    }
    process.exit(1)
  })
  
  server.on('close', () => {
    console.log('Server closed')
    process.exit(1)
  })
}
