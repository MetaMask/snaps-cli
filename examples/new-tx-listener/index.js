wallet.onNewTx(handleTx)

function handleTx (txMeta) {
  console.log(`Plugin detected txMeta: ${JSON.stringify(txMeta)}`)
}

