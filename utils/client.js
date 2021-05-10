var client

module.exports.setClient = c => {
  client = c
}

module.exports.getClient = () => {
  return client
}

module.exports.sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
