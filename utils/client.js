var client

module.exports.setClient = c => {
  client = c
}

module.exports.getClient = () => {
  return client
}
