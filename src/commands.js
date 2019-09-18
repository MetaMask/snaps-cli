
const fs = require('fs')
const pathUtils = require('path')
const chokidar = require('chokidar')
const http = require('http')
const serveHandler = require('serve-handler')
const dequal = require('fast-deep-equal')
const SES = require('ses')

const { bundle } = require('./build')
const {
  logError, getOutfilePath, validateDirPath,
  validateFilePath, validateOutfileName,
  isFile
} = require('./utils')

const manifest = require('./manifest')

module.exports = {
  build,
  sesEval,
  serve,
  watch,
  manifest,
}

// build

/**
 * Builds all files in the given source directory to the given destination
 * directory.
 * 
 * Creates destination directory if it doesn't exist.
 * 
 * @param {object} argv - argv from Yargs
 * @param {string} argv.src - The source file path
 * @param {string} argv.dist - The output directory path
 * @param {string} argv.'outfile-name' - The output file name
 */
async function build(argv) {

  const { src, dist, ['outfile-name']: outfileName } = argv
  if (outfileName) validateOutfileName(outfileName)
  await validateFilePath(src)
  await validateDirPath(dist, true)

  const result = await bundle(src, getOutfilePath(dist, outfileName))
  if (result && argv.manifest) manifest(argv)
}

// watch

/**
 * Watch a directory and its subdirectories for changes, and build when files
 * are added or changed.
 * 
 * Ignores 'node_modules' and dotfiles.
 * Creates destination directory if it doesn't exist.
 * 
 * @param {object} argv - argv from Yargs
 * @param {string} argv.src - The source file path
 * @param {string} argv.dist - The output directory path
 * @param {string} argv.'outfile-name' - The output file name
 */
async function watch(argv) {

  const { src, dist, ['outfile-name']: outfileName } = argv
  if (outfileName) validateOutfileName(outfileName)
  await validateFilePath(src)
  await validateDirPath(dist, true)
  const root = (
    src.indexOf('/') !== -1
      ? src.substring(0, src.lastIndexOf('/') + 1)
      : '.'
  )
  const outfilePath = getOutfilePath(dist, outfileName)

  const watcher = chokidar.watch(root, {
    ignoreInitial: true,
    ignored: [
      '**/node_modules/**',
      `**/${dist}/**`,
      `**/test/**`,
      `**/tests/**`,
      str => str !== '.' && str.startsWith('.')
    ]
  })

  watcher
    .on('ready', () => {
      bundle(src, outfilePath)
    })
    .on('add', path => {
      console.log(`File added: ${path}`)
      bundle(src, outfilePath)
    })
    .on('change', path => {
      console.log(`File changed: ${path}`)
      bundle(src, outfilePath)
    })
    .on('unlink', path => console.log(`File removed: ${path}`))
    .on('error', err => {
      logError('Watch error: ' + err.message)
    })

  watcher.add(`${root}`)
  console.log(`Watching '${root}' for changes...`)
}

// serve

/**
 * Starts a local, static HTTP server on the given port with the given root
 * directory.
 * 
 * @param {object} argv - argv from Yargs
 * @param {string} argv.root - The root directory path string
 * @param {number} argv.port - The server port
 */
async function serve (argv) {

  const { port, root } = argv

  await validateDirPath(root)

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

// eval

async function sesEval (argv) {
  const { plugin } = argv
  await validateFilePath(plugin)
  const s = SES.makeSESRootRealm({consoleMode: 'allow', errorStackMode: 'allow'})
  try {
    s.evaluate(fs.readFileSync(plugin))
    console.log('SES evaluation successful!')
  } catch (err) {
    logError(`SES Evaluation error: ${err.message}`, err)
    process.exit(1)
  }
}
