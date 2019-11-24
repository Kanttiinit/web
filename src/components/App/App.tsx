import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import { DataContextProvider } from '../../contexts';
import {
  preferenceContext,
  PreferenceContextProvider,
  PropertyContextProvider,
  UIStateProvider
} from '../../contexts';
import useSideEffects from '../../utils/useSideEffects';
import AreaSelector from '../AreaSelector';
import AssetsLoading from '../AssetsLoading';
import ChangeLog from '../ChangeLog';
import Clients from '../Clients';
import Contact from '../Contact';
import FavoriteSelector from '../FavoriteSelector';
import Footer from '../Footer';
import Modal from '../Modal';
import NotFound from '../NotFound';
import ReportModal from '../ReportModal';
import RestaurantList from '../RestaurantList';
import Map from '../Map';
import RestaurantModal from '../RestaurantModal';
import Settings from '../Settings';
import TermsOfService from '../TermsOfService';
import TopBar from '../TopBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const themeConstants = {
  breakLarge: '768px',
  breakSmall: '767px',
  dark: false
};

const SideEffects = withRouter(props => {
  useSideEffects(props.location, props.history);
  return <span />;
});

const App = () => {
  const [theme, setTheme] = React.useState(themeConstants);
  const preferences = React.useContext(preferenceContext);

  React.useEffect(() => {
    setTheme({ ...theme, dark: preferences.darkMode });
  }, [preferences.darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Container>
          <div>
            <Switch>
              <Route path="/map">
                <TopBar root={'/map'} />
                <Map />
                <Footer root={'/map'} />
              </Route>
              <Route path="/">
                <TopBar root={''} />
                <RestaurantList />
                <Footer root={''} />
              </Route>
            </Switch>
          </div>
        </Container>
        <Modal>
          <React.Suspense fallback={<AssetsLoading />}>
            <Switch>
              <Route exact path="/" render={null} />
              <Route path={['/settings/favorites', '/map/settings/favorites']}>
                <FavoriteSelector />
              </Route>
              <Route path={['/settings', '/map/settings']}>
                <Settings />
              </Route>
              <Route path={['/contact', '/map/contact']}>
                <Contact />
              </Route>
              <Route path={['/terms-of-service', '/map/terms-of-service']}>
                <TermsOfService />
              </Route>
              <Route path={['/select-area', '/map/select-area']}>
                <AreaSelector />
              </Route>
              <Route path={['/clients', '/map/clients']}>
                <Clients />
              </Route>
              <Route path={['/news', '/map/news']}>
                <ChangeLog />
              </Route>
              <Route path="/restaurant/:id">
                {({ match }: any) => (
                  <RestaurantModal restaurantId={match.params.id} />
                )}
              </Route>
              <Route path="/report/:restaurantId">
                {({ match }: any) => (
                  <ReportModal restaurantId={match.params.restaurantId} />
                )}
              </Route>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </React.Suspense>
        </Modal>
      </React.Fragment>
    </ThemeProvider>
  );
};

export default () => (
  <PropertyContextProvider>
    <UIStateProvider>
      <PreferenceContextProvider>
        <DataContextProvider>
          <App />
          <SideEffects />
        </DataContextProvider>
      </PreferenceContextProvider>
    </UIStateProvider>
  </PropertyContextProvider>
);
