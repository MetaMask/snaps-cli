#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable node/no-unpublished-require */

const { cli } = require('./cli.js');
const { applyConfig } = require('./utils.js');

main();

// application
async function main() {
  await applyConfig();
  cli();
}

