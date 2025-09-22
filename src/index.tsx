import 'url-polyfill';

import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import App from './components/App';
// import Map from './components/Map';
import Global from './globalStyles';
import './fonts.css';
import { lazy } from 'solid-js';
import { ErrorBoundary } from './components/ErrorBoundary';
const Admin = lazy(() => import('./admin'));

const RestaurantModal = lazy(() => import('./components/RestaurantModal'));
const ReportModal = lazy(() => import('./components/ReportModal'));
import Settings from './components/Settings';
import TermsOfService from './components/TermsOfService';
import NotFound from './components/NotFound';
import ChangeLog from './components/ChangeLog';
import Clients from './components/Clients';
import Contact from './components/Contact';

render(
  () => (
    <ErrorBoundary>
      <Global />
      <Router>
        <Route path="/admin/*" component={Admin} />
        {/* <Route path="/map" element={<Map />} /> */}
        <Route path="*" component={App}>
          <Route path="/" component={() => <></>} />
          <Route path="/settings" component={Settings} />
          <Route path="/contact" component={Contact} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/clients" component={Clients} />
          <Route path="/news" component={ChangeLog} />
          <Route path="/restaurant/:id" component={RestaurantModal} />
          <Route path="/report/:id" component={ReportModal} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    </ErrorBoundary>
  ),
  document.getElementById('root')!
);
