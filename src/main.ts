#!/usr/bin/env node

import { cli } from './cli';
import { applyConfig } from './utils';
import commands from './cmds';

main();

// application
async function main() {
  await applyConfig();
  cli(commands);
}
