module.exports = page => {
  const {hash, search} = window.location
  const accessTokenRegexp = /#access_token\=([^&]+)/
  const accessTokenMatch = hash.match(accessTokenRegexp)
  if (accessTokenMatch) {
    const provider = search.match(/\?facebook/) ? 'facebook' : 'google'
    page(location.pathname)
    return {
      provider,
      token: accessTokenMatch[1]
    }
  }
}
