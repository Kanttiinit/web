import 'url-polyfill';

import { render } from 'solid-js/web';
import { Route, Router, Routes } from '@solidjs/router';

import App from './components/App';
// import Map from './components/Map';
import Global from './globalStyles';
import './fonts.css';
import { lazy } from 'solid-js';
import { ErrorBoundary } from './components/ErrorBoundary';
const Admin = lazy(() => import('./admin'));

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
