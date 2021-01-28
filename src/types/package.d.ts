interface Wallet {
    [key : string]: string | Object | undefined | number
    bundle?: { local?: string, url?: string };
    initialPermissions?: object;
    requiredPermissions?: object;
}

export interface JSONPackage {
    [key : string]: string | Object | undefined | number
    main?: string;
    web3Wallet?: Wallet;
}

interface BuilderBlock {
    alias?: string | Array<string>,
    describe: string,
    type: string,
    required: boolean,
    default: string | number | boolean,
    choices?: string | Array<string>
}

export interface Builder {
    [key: string]: BuilderBlock,
    src: BuilderBlock,
    dist: BuilderBlock,
    bundle: BuilderBlock,
    root: BuilderBlock,
    port: BuilderBlock,
    sourceMaps: BuilderBlock,
    stripComments: BuilderBlock,
    outfileName: BuilderBlock,
    manifest: BuilderBlock,
    populate: BuilderBlock,
    eval: BuilderBlock,
    verboseErrors: BuilderBlock,
    suppressWarnings: BuilderBlock,
    environment: BuilderBlock,
}