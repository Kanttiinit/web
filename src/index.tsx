import 'url-polyfill';

import { ErrorBoundary as SolidErrorBoundary, render } from 'solid-js/web';
import { Route, Router, Routes } from "@solidjs/router";

import App from './components/App';
// import AssetsLoading from './components/AssetsLoading';
// import Map from './components/Map';
import Global from './globalStyles';
import * as consts from './utils/consts';
import { state } from './state';

declare let window: any;

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

export function ErrorBoundary(props: { children: any, fallback?: any }) {
  return (
    <SolidErrorBoundary fallback={error => {
      console.error(error);
      
      if (consts.isProduction) {
        window.Sentry.captureException(error);
      }

      return props.fallback || <ErrorMessage />;
    }}>
      {props.children}
    </SolidErrorBoundary>
  );
}

const ErrorMessage = () => {
  return <p>{state.translations.errorDetails}</p>;
};

render(
  () => (
    <ErrorBoundary>
      <Global />
      <Router>
        <Routes>
          {/* <Route path="/map" element={<Map />} /> */}
          <Route path="*" component={App} />
        </Routes>
      </Router>
    </ErrorBoundary>
  ),
  document.getElementById('root')!
);
