import * as React from 'react'
import { render } from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import ErrorBoundary from 'react-error-boundary'
import 'url-polyfill'

import {version} from './utils/consts'
import App from './components/App'
import Text from './components/Text'
import {reportError} from './utils/api'

let lastCheck = Math.round(Date.now() / 1000)
window.addEventListener('focus', async () => {
  const now = Math.round(Date.now() / 1000)
  if (!lastCheck || now - lastCheck > 3600) {
    lastCheck = now
    const response = await fetch(`/check-update?version=${version}`)
    const json = await response.json()
    if (json.updateAvailable) {
      window.location.reload()
    }
  }
})

const Error = () => <Text component="p" id="errorDetails" />

render(
  <ErrorBoundary FallbackComponent={Error} onError={reportError}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
, document.getElementById('root'))
