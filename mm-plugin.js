#!/usr/bin/env node

const fs = require('fs')
const yargs = require('yargs')

const {
  build, manifest, serve, watch
} = require('./src/commands')

// globals

global.mm_plugin = {
  verbose: false,
}

// yargs config and constants

const CONFIG_PATH = './.mm-plugin.json'

const builders = {
  src: {
    describe: 'Source file or directory',
    type: 'string',
  },
  dest: {
    describe: 'Output file or directory',
    type: 'string',
  },
  root: {
    describe: 'Server root directory',
    type: 'string',
  },
  port: {
    describe: 'Server port',
    type: 'number',
    default: 8080
  },
}

applyConfig()

// application

yargs
  .usage('Usage: $0 [command] [options]')
  .example('$0 plugin.js ./out', `\tBuild 'plugin.js' as './out/plugin.json'`)
  .example('$0 serve ./out', `\tServe files in './out' on port 8080`)
  .example('$0 serve ./out 9000', `\tServe files in './out' on port 9000`)
  .example('$0 watch ./src ./out', `\tRebuild files in './src' to './out' on change`)
  .command(
    ['$0 [src] [dest]', 'build', 'b'],
    'Build plugin file(s) from source',
    yargs => {
      yargs
        .positional('src', builders.src)
        .positional('dest', builders.dest)
    },
    argv => build(argv)
  )
  .command(
    ['manifest [src]', 'm'],
    'Generate plugin manifest file(s) from source',
    yargs => {
      yargs
        .positional('src', builders.src)
    },
    argv => manifest(argv)
  )
  .command(
    ['serve [root] [port]', 's'],
    'Locally serve plugin file(s)',
    yargs => {
      yargs
        .positional('root', builders.root)
        .positional('port', builders.port)
    },
    argv => serve(argv)
  )
  .command(
    ['watch [src] [dest]', 'w'],
    'Build file(s) on change',
    yargs => {
      yargs
        .positional('src', builders.src)
        .positional('dest', builders.dest)
    },
    argv => watch(argv)
  )
  .option('verbose', {
    alias: 'v',
    boolean: true,
    describe: 'Display original errors'
  })
  .middleware(argv => {
    mm_plugin.verbose = Boolean(argv.verbose)
  })
  .help()
  .alias('help', 'h')
  .fail((msg, err, _yargs) => {
    console.error(msg || err.message)
    if (err && err.stack && mm_plugin.verbose) console.error(err.stack)
    process.exit(1)
  })
  .argv

// misc

/**
 * Attempts to read the config file and apply the config to
 * globals.
 */
function applyConfig () {
  let cfg = {}
  try {
    cfg = JSON.parse(fs.readFileSync(CONFIG_PATH))
  } catch (_) {}
  if (!cfg || typeof cfg !== 'object' || Object.keys(cfg).length === 0) return
  if (cfg['src']) {
    builders.src.default = cfg['src']
  }
  if (cfg['dest']) {
    builders.dest.default = cfg['dest']
    builders.root.default = cfg['dest']
  }
  if (cfg['root']) {
    builders.root.default = cfg['root']
  }
  if (cfg['port']) {
    builders.port.default = cfg['port']
  }
}
