import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';
import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'url-polyfill';

import App from './components/App';
import AssetsLoading from './components/AssetsLoading';
import Map from './components/Map';
import { LangContextProvider } from './contexts';
import Global from './globalStyles';
import * as consts from './utils/consts';
import { useTranslations } from './utils/hooks';
import './worker/registerWorker';

const useBugSnag = !!process.env.BUGSNAG_API_KEY;

let bugsnagClient: any;
if (useBugSnag) {
  bugsnagClient = bugsnag({
    apiKey: process.env.BUGSNAG_API_KEY,
    appVersion: consts.version
  });

  bugsnagClient.metadata = {
    isBeta: consts.isBeta
  };
}
const ErrorMessage = () => {
  const translations = useTranslations();
  return <p>{translations.errorDetails}</p>;
};

export const ErrorBoundary = useBugSnag
  ? bugsnagClient.use(createPlugin(React))
  : ({ children }: { children: React.ReactNode }) => children;

render(
  <LangContextProvider>
    <ErrorBoundary FallbackComponent={ErrorMessage}>
      <BrowserRouter>
        <React.Suspense fallback={<AssetsLoading />}>
          <Switch>
            <Route path="/map">
              <Map />
            </Route>
            <Route>
              <App />
            </Route>
          </Switch>
        </React.Suspense>
      </BrowserRouter>
      <Global />
    </ErrorBoundary>
  </LangContextProvider>,
  document.getElementById('root')
);
