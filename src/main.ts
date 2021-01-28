#!/usr/bin/env node

import { cli } from './cli';
const commands = require('./cmds');
const { applyConfig } = require('./utils');

main();

// application
async function main() {
  await applyConfig();
  cli(commands);
}
