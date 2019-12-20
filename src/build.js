
const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const { logError } = require('./utils')
// const terser = require('terser')
//

const lavamoatOpts = {
  config: './lavamoat-config.json',
  writeAutoConfig: true,
}
const lavamoatPluginOpts = [
  [ 'lavamoat-browserify', lavamoatOpts ],
]
// These globals are already added to the snaps-beta as endowments,
// and so do not need to initiate warnings yet:
const permittedGlobals = [
  'console',
  'BigInt',
  'setInterval',
  'clearInterval',
  'setTimeout',
  'clearTimeout',
  'crypto',
  'crypto.getRandomValues',
  'SubtleCrypto',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'Buffer',
  'Date',
  'MessageChannel',
  'atob',
  'btoa',
  'define',
]


module.exports = {
  bundle: bundle,
}

/**
 * Builds a Snap bundle JSON file from its JavaScript source.
 *
 * @param {string} src - The source file path
 * @param {string} dest - The destination file path
 * @param {object} argv - argv from Yargs
 * @param {boolean} argv.sourceMaps - Whether to output sourcemaps
 */
function bundle(src, dest, argv) {

  // Warn about global usage by default:
  if (argv.gw) {
    analyzeGlobalUsage(src, dest, argv)
  }

  return new Promise((resolve, _reject) => {

    const bundleStream = createBundleStream(dest)

    browserify(src, { debug: argv.sourceMaps })

      // TODO: Just give up on babel, which we may not even need?
      // This creates globals that SES doesn't like
      // .transform('babelify', {
      //   presets: ['@babel/preset-env'],
      // })
      .bundle((err, bundle) => {

        if (err) writeError('Build error:', err)

        // TODO: minification, probably?
        // const { error, code } = terser.minify(bundle.toString())
        // if (error) {
        //   writeError('Build error:', error.message, error, dest)
        // }
        // closeBundleStream(bundleStream, code.toString())

        closeBundleStream(bundleStream, bundle ? bundle.toString() : null)
        .then(() => {
          if (bundle) {
            console.log(`Build success: '${src}' bundled as '${dest}'!`)
          }

          resolve(true)
        })
        .catch((err) => writeError('Write error:', err.message, err, dest))
      })
  })
}

/**
 * Opens a stream to write the destination file path.
 *
 * @param {string} dest - The output file path
 * @returns {object} - The stream
 */
function createBundleStream (dest) {
  const stream = fs.createWriteStream(dest, {
    autoClose: false,
    encoding: 'utf8',
  })
  stream.on('error', err => {
    writeError('Write error:', err.message, err, dest)
  })
  return stream
}

/**
 * Builds the entire snap using lava-moat for purposes of generating a lavamoat-config file.
 * This file will allow us to identify obviously required global APIs, allowing the plugin to request them.
 *
 * @param {string} src - The source file path
 * @param {string} dest - The destination file path
 * @param {object} argv - argv from Yargs
 * @param {boolean} argv.sourceMaps - Whether to output sourcemaps
 */
function analyzeGlobalUsage(src, dest, argv) {

  return new Promise((resolve, _reject) => {

    const bundleStream = createBundleStream(dest)

    browserify(src, {
      debug: argv.sourceMaps,
      plugin: lavamoatPluginOpts,
    })

      // TODO: Just give up on babel, which we may not even need?
      // This creates globals that SES doesn't like
      // .transform('babelify', {
      //   presets: ['@babel/preset-env'],
      // })
      .bundle((err, bundle) => {

        if (err) writeError('Build error:', err)

        // TODO: minification, probably?
        // const { error, code } = terser.minify(bundle.toString())
        // if (error) {
        //   writeError('Build error:', error.message, error, dest)
        // }
        // closeBundleStream(bundleStream, code.toString())

        closeBundleStream(bundleStream, bundle ? bundle.toString() : null)
        .then(() => {
          if (!bundle) {
            return console.log(`Lava build failed, unable to analyze for global API usage.`)
          }

          const lavaConfigString = fs.readFileSync(path.join(process.cwd(), 'lavamoat-config.json')).toString()
          const lavaConfig = JSON.parse(lavaConfigString)
          const requiredGlobals = listGlobals(lavaConfig)
          if (requiredGlobals.length > 0) {
            console.log(`Your snap bundle requires access to global APIs that are not available to a MetaMask Snap's environment by default. We will make these APIs requestible permissions, but for now you will need to fork MetaMask to allow these APIs to be used within MetaMask. You can refer to this pull request for reference of how: https://github.com/MetaMask/metamask-snaps-beta/pull/134`)
            console.log(`Your required global APIs are:\n- ${requiredGlobals.join('\n- ')}`)
          }

          resolve(true)
        })
        .catch((err) => writeError('Write error:', err.message, err, dest))
      })
  })
}

function listGlobals (lavamoatConfig) {
  const globalSet = new Set()
  for (let module in lavamoatConfig.resources) {
    if (lavamoatConfig.resources[module].globals) {
      for (let global in lavamoatConfig.resources[module].globals) {
        globalSet.add(global)
      }
    }
  }
  const globalArr = []
  for (let entry of globalSet) {
    if (!permittedGlobals.includes(entry)) {
      globalArr.push(entry)
    }
  }
  return globalArr
}

/**
 * Opens a stream to write the destination file path.
 *
 * @param {string} dest - The output file path
 * @returns {object} - The stream
 */
function createBundleStream (dest) {
  const stream = fs.createWriteStream(dest, {
    autoClose: false,
    encoding: 'utf8',
  })
  stream.on('error', err => {
    writeError('Write error:', err.message, err, dest)
  })
  return stream
}

/**
 * Postprocesses the bundle string and closes the write stream.
 *
 * @param {object} stream - The write stream
 * @param {string} bundleString - The bundle string
 */
async function closeBundleStream (stream, bundleString) {
  stream.end(postProcess(bundleString), (err) => {
    if (err) throw err
  })
}

/**
 * Postprocesses a JavaScript bundle string such that it can be evaluated in SES.
 * Currently:
 * - converts certain dot notation to string notation (for indexing)
 * - makes all direct calls to eval indirect
 * - wraps original bundle in anonymous function
 * - handles certain Babel-related edge cases
 *
 * @param {string} bundleString - The bundle string
 * @returns {string} - The postprocessed bundle string
 */
function postProcess (bundleString) {

  if (typeof bundleString !== 'string') {
    return null
  }

  bundleString = bundleString.trim()

  // .import( => ["import"](
  bundleString = bundleString.replace(/\.import\(/g, '["import"](')

  // stuff.eval(otherStuff) => (1, stuff.eval)(otherStuff)
  bundleString = bundleString.replace(
    /((?:\b[\w\d]*[\]\)]?\.)+eval)(\([^)]*\))/g,
    '(1, $1)$2'
  )

  // if we don't do the above, the below causes syntax errors if it encounters
  // things of the form: "something.eval(stuff)"
  // eval(stuff) => (1, eval)(stuff)
  bundleString = bundleString.replace(/(\b)(eval)(\([^)]*\))/g, '$1(1, $2)$3')

  // SES interprets syntactically valid JavaScript '<!--' and '-->' as illegal
  // HTML comment syntax.
  // '<!--' => '<! --' && '-->' => '-- >'
  bundleString = bundleString.replace(/<!--/g, '< !--')
  bundleString = bundleString.replace(/-->/g, '-- >')

  // Browserify provides the Buffer global as an argument to modules that use
  // it, but this does not work in SES. Since we pass in Buffer as an endowment,
  // we can simply remove the argument.
  bundleString = bundleString.replace(/^\(function \(Buffer\)\{$/gm, '(function (){')

  if (bundleString.length === 0) throw new Error(
    `Bundled code is empty after postprocessing.`
  )

  // wrap bundle conents in anonymous function
  if (bundleString.endsWith(';')) bundleString = bundleString.slice(0, -1)
  if (bundleString.startsWith('(') && bundleString.endsWith(')')) {
    bundleString = '() => ' + bundleString
  } else {
    bundleString = '() => (\n' + bundleString + '\n)'
  }

  // handle some cases by declaring missing globals
  // Babel regeneratorRuntime
  if (bundleString.indexOf('regeneratorRuntime') !== -1) {
    bundleString = 'var regeneratorRuntime;\n' + bundleString
  }

  return bundleString
}

/**
 * Logs an error, attempts to unlink the destination file, and exits.
 *
 * @param {string} prefix - The message prefix.
 * @param {string} msg - The error message
 * @param {Error} err - The original error
 * @param {string} destFilePath - The output file path
 */
function writeError (prefix, msg, err, destFilePath) {

  if (!prefix.endsWith(' ')) prefix += ' '

  logError(prefix + msg, err)
  try {
    if (destFilePath) fs.unlinkSync(destFilePath)
  } catch (_err) {}

  // unless the watcher is active, exit
  if (!snaps.isWatching) {
    process.exit(1)
  }
}
