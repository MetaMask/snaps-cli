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

interface BuilderBlock {
  alias?: string | string[];
  describe: string;
  type: string;
  required: boolean;
  default: string | number | boolean;
  choices?: string | string[];
}

export interface Builder {
  [key: string]: BuilderBlock;
  src: BuilderBlock;
  dist: BuilderBlock;
  bundle: BuilderBlock;
  root: BuilderBlock;
  port: BuilderBlock;
  sourceMaps: BuilderBlock;
  stripComments: BuilderBlock;
  outfileName: BuilderBlock;
  manifest: BuilderBlock;
  populate: BuilderBlock;
  eval: BuilderBlock;
  verboseErrors: BuilderBlock;
  suppressWarnings: BuilderBlock;
  environment: BuilderBlock;
}
