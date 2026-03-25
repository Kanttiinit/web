import { Route, Router } from '@solidjs/router';
import { render } from 'solid-js/web';

import App from './components/App';
import Global from './globalStyles';
import './fonts.css';
import { createEffect, lazy } from 'solid-js';
import { ErrorBoundary } from './components/ErrorBoundary';
import { computedState } from './state';

const Admin = lazy(() => import('./admin'));
const MapView = lazy(() => import('./components/MapView/MapView'));

const RestaurantModal = lazy(() => import('./components/RestaurantModal'));
const ReportModal = lazy(() => import('./components/ReportModal'));

import ChangeLog from './components/ChangeLog';
import Clients from './components/Clients';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Settings from './components/Settings';
import TermsOfService from './components/TermsOfService';

function DarkModeEffect() {
  createEffect(() => {
    if (computedState.darkMode()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });
  return null;
}

render(
  () => (
    <ErrorBoundary>
      <Global />
      <DarkModeEffect />
      <Router>
        <Route path="/admin/*" component={Admin} />
        <Route path="/map" component={MapView} />
        <Route path="*" component={App}>
          <Route path="/" component={() => <></>} />
          <Route path="settings" component={Settings} />
          <Route path="contact" component={Contact} />
          <Route path="terms-of-service" component={TermsOfService} />
          <Route path="clients" component={Clients} />
          <Route path="news" component={ChangeLog} />
          <Route path="restaurant/:id" component={RestaurantModal} />
          <Route path="report/:id" component={ReportModal} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    </ErrorBoundary>
  ),
  document.getElementById('root')!,
);
