import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'url-polyfill';
import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';

import './utils/globalHooks';
import './worker/registerWorker';
import * as consts from './utils/consts';
import App from './components/App';
import Map from './components/Map';
import Text from './components/Text';
import './styles/global.scss';

const useBugSnag = !!process.env.BUGSNAG_API_KEY;

let bugsnagClient;
if (useBugSnag) {
  bugsnagClient = bugsnag({
    appVersion: consts.version,
    apiKey: process.env.BUGSNAG_API_KEY
  });

  bugsnagClient.metadata = {
    isBeta: consts.isBeta
  };
}
const ErrorMessage = () => <Text element="p" id="errorDetails" />;

export const ErrorBoundary = useBugSnag
  ? bugsnagClient.use(createPlugin(React))
  : ({ children }) => children;

render(
  <ErrorBoundary FallbackComponent={ErrorMessage}>
    <BrowserRouter>
      <Switch>
        <Route path="/map">
          <Map />
        </Route>
        <Route>
          <App />
        </Route>
      </Switch>
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById('root')
);
