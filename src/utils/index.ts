export * from './config';
export * from './fs';
export * from './globals';
export * from './logs';
export * from './process';
export * from './readline';
export * from './validate';

export const permRequestKeys = [
  '@context',
  'id',
  'parentCapability',
  'invoker',
  'date',
  'caveats',
  'proof',
];

export const CONFIG_PATHS = [
  'snap.config.json',
];

global.snaps = {
  verboseErrors: false,
  suppressWarnings: false,
  isWatching: false,
};
