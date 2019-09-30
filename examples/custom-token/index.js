const { errors: rpcErrors } = require('eth-json-rpc-errors')

const userBalance = 0;
const created = false;

const asset = {
  symbol: 'CUSTOM',
  balance: userBalance.toString(),
  identifier: 'this-plugins-only-asset',
  image: 'https://placekitten.com/200/200',
  decimals: 0,
  customViewUrl: 'http://localhost:8085/index.html'
}

updateUi();

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'getBalance':
      return userBalance;
    case 'mint':
      userBalance += (requestObject.params[0] || 1);
      updateUi();
      return userBalance;
    case 'burn':
      userBalance -= (requestObject.params[0] || userBalance);
      updateUi();
      return userBalance;
    default:
      throw rpcErrors.eth.methodNotFound()
  }
})

function updateUi () {
  asset.balance = String(userBalance);

  wallet.send({
    method: 'wallet_manageAssets',
    params: [
      created ? 'updateAsset' : 'createAsset',
      asset,
    ],
  })
}

