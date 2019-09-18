
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

// manifest

async function manifest (argv) {

  console.log('Validating package.json...')
  const isValid = true
  const didUpdate = false

  const { dist, ['outfile-name']: outfileName } = argv
  if (!dist) {
    throw new Error(`Invalid params: must provide 'dist'`)
  }

  let pkg
  try {
    pkg = JSON.parse(fs.readFileSync('package.json'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(
        `Manifest error: Could not find package.json. Please ensure that ` +
        `you are running the command in the project root directory.`
      )
    }
    throw new Error(`Could not parse package.json`, err)
  }

  if (!pkg || typeof pkg !== 'object') {
    throw new Error(`Invalid parsed package.json: ${pkg}`)
  }
  
  // attempt to set missing/erroneous properties if commanded
  if (argv.populate) {

    let old = { ...pkg.web3Wallet }

    if (!pkg.web3Wallet) {
      pkg.web3Wallet = {}
    }

    let { bundle, requiredPermissions } = pkg.web3Wallet
    const bundlePath = pathUtils.join(
      dist, outfileName || 'bundle.js'
    ).toString()
    if (bundle !== bundlePath) pkg.web3Wallet.bundle = bundlePath

    if (!requiredPermissions) {
      pkg.web3Wallet.requiredPermissions = []
    }
    pkg.web3Wallet.requiredPermissions.sort()

    if (!dequal(old, pkg.web3Wallet)) didUpdate = true
  }

  const existing = Object.keys(pkg)
  const required = [
    'name', 'version', 'description', 'main', 'repository', 'web3Wallet'
  ]
  const missing = required.filter(k => !existing.includes(k))
  if (missing.length > 0) {
    logManifestError(
      `Missing required package.json properties:\n` +
      missing.reduce((acc, curr) => {
        acc += curr + '\n'
        return acc
      }, '')
    )
  }

  const { bundle, requiredPermissions } = pkg.web3Wallet || {}
  if (bundle) {
    let res = await isFile(bundle)
    if (!res) {
      logManifestError(`'bundle' does not resolve to a file.`)
    }
  } else {
    logManifestError(`Missing required 'web3Wallet' property 'bundle'.`)
  }

  if (requiredPermissions) {
    if (!Array.isArray(requiredPermissions)) {
      logManifestError(`'web3Wallet' property 'requiredPermissions' must be an array.`)
    } else if (requiredPermissions.length === 0) {
      console.log(
        `Manifest Warning: 'web3Wallet' property 'requiredPermissions' is empty. ` +
        `This probably makes your plugin trivial. Please ensure you list all ` +
        `permissions your plugin uses.`
      )
    }
  } else {
    logManifestError(`Missing required 'web3Wallet' property 'requiredPermissions'.`)
  }

  if (isValid) {
    console.log(`Successfully validated package.json!`)
  } else {
    throw new Error(`package.json validation failed, please see above warnings`)
  }

  if (argv.populate && didUpdate) {
    fs.writeFile('package.json', JSON.stringify(pkg, null, 2), (err) => {
      if (err) throw new Error(`Could not write package.json`, err)
      console.log('Successfully updated package.json!')
    })
  }

  function logManifestError(message, err) {
    isValid = false
    console.error(`Manifest Error: ${message}`)
    if (err && mm_plugin.verbose) console.error(err)
  }
}
