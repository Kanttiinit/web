import * as React from 'react'
import { render } from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import ErrorBoundary from 'react-error-boundary'
import 'url-polyfill'

import App from './components/App'
import Text from './components/Text'
import {reportError} from './utils/api'

const Error = () => <Text component="p" id="errorDetails" />

render(
  <ErrorBoundary FallbackComponent={Error} onError={reportError}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
, document.getElementById('root'))
