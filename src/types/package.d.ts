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