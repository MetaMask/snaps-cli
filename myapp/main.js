#!/usr/bin/env node
/* eslint-disable node/shebang */

const { applyConfig } = require('./misc.js');
const { cli } = require('./cli.js');

main();

// application
async function main() {
  await applyConfig();
  cli();
}

