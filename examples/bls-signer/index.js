const { errors: rpcErrors } = require('eth-json-rpc-errors')
const { PrivateKey, PublicKey } = require('bls-signatures');

const DOMAIN = 2;
const PRIVATE_KEY_PROMISE = wallet.getAppKey();

wallet.registerRpcMessageHandler(async (_originString, requestObject) => {
  switch (requestObject.method) {

    case 'getAccount':
      return getPubKey().serialize().toString();

    case 'signMessage':
      const pubKey = await getPubKey();
      const data = requestObject.params[0]
      const approved = confirm(`Do you want to sign ${data} with ${pubKey}?`)
      if (!approved) {
        throw rpcErrors.eth.unauthorized()
      }
      const PRIVATE_KEY = await getPrivKey();
      const sig = privateKey.sign(Uint8Array.from(Buffer.from(data)));
      return sig

    default:
      throw rpcErrors.eth.methodNotFound()
  }
})

async function getPrivKey() {
  const PRIV_KEY = await PRIVATE_KEY_PROMISE;
  const privateKey = PrivateKey.fromBytes(PRIV_KEY, true);
  return PRIV_KEY;
}

async function getPubKey () {
  const privateKey = getPrivKey();
  return privateKey.GetPublicKey();
}

