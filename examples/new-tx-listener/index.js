wallet.onMetaMaskEvent('newUnapprovedTx', handleTx)

function handleTx (txMeta) {
  console.log(`Plugin detected txMeta: ${JSON.stringify(txMeta)}`)
}

wallet.registerRpcMessageHandler(
  async (originString, requestObject) => {
    switch (requestObject.method) {
      case 'ping':
        return 'pong'
      default:
        throw new Error('Method not found.')
    }
  }
)

