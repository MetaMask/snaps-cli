#!/usr/bin/env node
import { cli } from './cli';
import { allCommands } from './cmds';

global.snaps = {
  verboseErrors: false,
  suppressWarnings: false,
  isWatching: false,
};

cli(process.argv, allCommands);
