const IdentityWallet = require('identity-wallet');
wallet.onUnlock(async () => {
  const threeIdProvider = new IdentityWallet({ seed: await wallet.getAppKey() });
  console.log('THREE ID PROVIDER:', threeIdProvider);
  wallet.registerRpcHandler((origin, req) => { return threeIdProvider.send(req) });
})
