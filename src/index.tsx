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

declare var window: any;

if (consts.isProduction) {
  try {
    window.Sentry.init({
      dsn: 'https://374810f1636c4ad4a3e669a7f8621a4f@sentry.io/1466161',
      release: consts.isProduction ? consts.version : 'DEV'
    });
  } catch (e) {
    console.warn('Couldn\'t initialise Sentry:', e);
  }
}

const ErrorMessage = () => {
  const translations = useTranslations();
  return <p>{translations.errorDetails}</p>;
};

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.PureComponent<any, State> {
  state: State = { error: null };

  componentDidCatch(error: Error) {
    if (consts.isProduction) {
      window.Sentry.captureException(error);
    }
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage />;
    }
    return this.props.children;
  }
}

render(
  <LangContextProvider>
    <ErrorBoundary>
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
