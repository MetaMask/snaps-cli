const { errors: rpcErrors } = require('eth-json-rpc-errors')
let created = false
let account = {
  address: '0x100000000000000000000',
}

updateUi();

wallet.registerAccountMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'eth_sign':
      return '0xFAKEO';
    default:
      throw rpcErrors.methodNotFound(requestObject)
  }
})

function updateUi () {
  let method = created ? 'update' : 'add';

  // addAsset will update if identifier matches.
  wallet.send({
    method: 'wallet_manageIdentities',
    params: [ method, account ],
  })

  created = true
}

