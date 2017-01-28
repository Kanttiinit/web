// @flow
import {browserHistory} from 'react-router'

export default () => {
  const {hash, search} = window.location
  const accessTokenRegexp = /#access_token\=([^&]+)/
  const accessTokenMatch = hash.match(accessTokenRegexp)
  if (accessTokenMatch) {
    const provider = search.match(/\?facebook/) ? 'facebook' : 'google'
    browserHistory.push(location.pathname)
    return {
      provider,
      token: accessTokenMatch[1]
    }
  }
}
