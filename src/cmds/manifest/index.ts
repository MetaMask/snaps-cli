const builders = require('../../builders');
const { manifest } = require('./manifest');
import { logError } from '../../utils';

import yargs from "yargs";
import { Argument } from "../../types/yargs";

module.exports.command = ['manifest', 'm'];
module.exports.desc = 'Validate project package.json as a Snap manifest';
module.exports.builder = (yarg: yargs.Argv) => {
  yarg
    .option('dist', builders.dist)
    .option('port', builders.port)
    .option('populate', builders.populate);
};

module.exports.handler = async (argv: Argument) => {
  try {
    await manifest(argv);
  } catch (err) {
    logError(err.message, err);
    process.exit(1);
  }
};
