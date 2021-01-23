const yargs = require('yargs');

function cli() {
  // eslint-disable-next-line no-unused-expressions
  yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .example('$0 init', `\tInitialize Snap package from scratch`)
    .example('$0 build -s index.js -d out', `\tBuild 'index.js' as './out/bundle.js'`)
    .example('$0 build -s index.js -d out -n snap.js', `\tBuild 'index.js' as './out/snap.js'`)
    .example('$0 serve -r out', `\tServe files in './out' on port 8080`)
    .example('$0 serve -r out -p 9000', `\tServe files in './out' on port 9000`)
    .example('$0 watch -s index.js -d out', `\tRebuild './out/bundle.js' on changes to files in 'index.js' parent and child directories`)
    .commandDir('cmds')
    .demandCommand(1, 'You must specify at least one command.')
    .help()
    .argv;
}

module.exports = { cli };
