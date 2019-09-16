
const fs = require('fs')
const pathUtils = require('path')

module.exports = {
  isDirectory,
  getOutfilePath,
  getOutfileName,
  logError,
  validatePaths,
}

// misc utils

function logError(msg, err) {
  console.error(msg)
  if (err && mm_plugin.verbose) console.error(err)
}

/**
 * Gets the complete out file path from the source file path and output
 * directory path. 
 * 
 * @param {string} srcFilePath - The source file path
 * @param {string} outDir - The out file directory
 * @returns {string} - The complete out file path
 */
function getOutfilePath(srcFilePath, outDir) {
  return pathUtils.join(outDir, getOutfileName(srcFilePath))
}

/**
 * Gets the out file name from the source file name/path.
 * (Swaps '.js' for '.json')
 * 
 * @param {string} srcFilePath - The source file path
 */
function getOutfileName (srcFilePath) {
  const split = srcFilePath.split('/')
  return split[split.length - 1].match(/(.+)\.js/)[1] + '.json'
}

/**
 * Validates paths for building or watching file(s).
 * 
 * @param {object} argv - Argv object from yargs
 * @param {string} argv.src - The src path
 * @param {string} argv.dest - The destination path
 */
async function validatePaths(argv) {

  const { src, dest } = argv

  if (!src || !dest) {
    throw new Error('Invalid params: must provide src and dest')
  }

  const result = {
    src: {
      path: src,
      isDirectory: await isDirectory(src),
    },
    dest: {
      path: dest,
      isDirectory: await isDirectory(dest),
    }
  }

  if (result.src.isDirectory && !result.dest.isDirectory) {
    throw new Error(
      `Invalid params: If 'src' is a directory, then 'dest' must be a directory. ` +
      `Does your destination directory exist?`
      )
  }

  if (!result.dest.isDirectory && !result.dest.path.endsWith('.json')) {
    throw new Error('Invalid params: Output file must be a JSON file.')
  }

  if (!result.src.isDirectory && result.dest.isDirectory) {
    result.dest = {
      path: pathUtils.join(result.dest.path, getOutfileName(result.src.path)),
      isDirectory: false,
    }
  }

  return result
}

/**
 * Checks whether the given path string resolves to an existing directory.
 * @param {string} p - the path string to check
 * @returns {boolean} - Whether the given path is an existing directory
 */
function isDirectory(p) {
  return new Promise((resolve, _) => {
    fs.stat(p, (err, stats) => {
      if (err || !stats) {
        if (err.code === 'ENOENT') return resolve(false)
        logError(
          `Invalid params: Path '${p}' could not be resolved.`,
          err
        )
        process.exit(1)
      }
      resolve(stats.isDirectory())
    })
  })
}
