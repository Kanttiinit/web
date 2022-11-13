import 'url-polyfill';

import {  render } from 'solid-js/web';
import { Route, Router, Routes } from "@solidjs/router";

import App from './components/App';
// import Map from './components/Map';
import Global from './globalStyles';
import './fonts.css';
import * as consts from './consts';
import { computedState } from './state';
import { lazy, ErrorBoundary as SolidErrorBoundary } from 'solid-js';
const Admin = lazy(() => import('./admin'));

export function ErrorBoundary(props: { children: any, fallback?: any }) {
  return (
    <SolidErrorBoundary fallback={error => {
      console.error(error);
      
      if (consts.isProduction) {
        // window.Sentry.captureException(error);
      }

      return props.fallback || <ErrorMessage />;
    }}>
      {props.children}
    </SolidErrorBoundary>
  );
}

const ErrorMessage = () => {
  return <p>{computedState.translations().errorDetails}</p>;
};

render(
  () => (
    <ErrorBoundary>
      <Global />
      <Router>
        <Routes>
          {/* <Route path="/map" element={<Map />} /> */}
          <Route path="/admin/*" component={Admin} />
          <Route path="*" component={App} />
        </Routes>
      </Router>
    </ErrorBoundary>
  ),
  document.getElementById('root')!
);
