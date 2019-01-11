import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Route, Switch, withRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import { DataContextProvider } from '../../contexts/dataContext';
import { LangContextProvider } from '../../contexts/langContext';
import preferenceContext, {
  PreferenceContextProvider
} from '../../contexts/preferencesContext';
import { PropertyContextProvider } from '../../contexts/propertyContext';
import uiContext, { UIStateProvider } from '../../contexts/uiContext';
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

  React.useEffect(
    () => {
      setTheme({ ...theme, dark: preferences.darkMode });
    },
    [preferences.darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Container>
          <div>
            <TopBar />
            <RestaurantList />
          </div>
          <Footer />
        </Container>
        <Modal>
          <React.Suspense fallback={<AssetsLoading />}>
            <Switch>
              <Route exact path="/" render={null} />
              <Route path="/settings/favorites">
                <FavoriteSelector />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/contact">
                <Contact />
              </Route>
              <Route path="/terms-of-service">
                <TermsOfService />
              </Route>
              <Route path="/select-area">
                <AreaSelector />
              </Route>
              <Route path="/clients">
                <Clients />
              </Route>
              <Route path="/news">
                <ChangeLog />
              </Route>
              <Route path="/restaurant/:id">
                {({ match }) => (
                  <RestaurantModal restaurantId={match.params.id} />
                )}
              </Route>
              <Route path="/report/:restaurantId">
                {({ match }) => (
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
    <LangContextProvider>
      <UIStateProvider>
        <PreferenceContextProvider>
          <DataContextProvider>
            <App />
            <SideEffects />
          </DataContextProvider>
        </PreferenceContextProvider>
      </UIStateProvider>
    </LangContextProvider>
  </PropertyContextProvider>
);
