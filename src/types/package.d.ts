import { Options } from 'yargs';

interface Wallet {
  [key: string]: string | Record<string, unknown> | undefined | number;
  bundle?: { local?: string; url?: string };
  initialPermissions?: Record<string, unknown>;
  requiredPermissions?: Record<string, unknown>;
}

export interface JSONPackage {
  [key: string]: string | Record<string, unknown> | undefined | number;
  main?: string;
  web3Wallet?: Wallet;
}

export interface Builder {
  [key: string]: Options;
  src: Options;
  dist: Options;
  bundle: Options;
  root: Options;
  port: Options;
  sourceMaps: Options;
  stripComments: Options;
  outfileName: Options;
  manifest: Options;
  populate: Options;
  eval: Options;
  verboseErrors: Options;
  suppressWarnings: Options;
  environment: Options;
}
