#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable node/no-unpublished-require */

const { cli } = require('./cli.js');
const { applyConfig } = require('./utils.js');
const { commands } = require('./cmds');

main();

// application
async function main() {
  await applyConfig();
  cli(commands);
}

