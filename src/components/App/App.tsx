import * as addDays from 'date-fns/add_days';
import * as React from 'react';
import * as GA from 'react-ga';
import { RouteComponentProps } from 'react-router';
import { Route, Switch, withRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import { DataContextProvider } from '../../contexts/dataContext';
import { useAutoUpdates } from '../../contexts/hooks';
import preferenceContext, {
  PreferenceContextProvider
} from '../../contexts/preferencesContext';
import uiContext, { UIStateProvider } from '../../contexts/uiContext';
import { isProduction, version } from '../../utils/consts';
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

function pageView(location: Location) {
  const pathname = location.pathname + location.search;
  GA.set({ page: pathname, 'App Version': version });
  GA.pageview(pathname);
}

const App = (props: RouteComponentProps<any>) => {
  useAutoUpdates();
  const [theme, setTheme] = React.useState(themeConstants);
  const preferences = React.useContext(preferenceContext);
  const ui = React.useContext(uiContext);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const offset = e.key === 'ArrowLeft' ? -1 : 1;
        const newDay = addDays(ui.selectedDay, offset);
        if (ui.isDateInRange(newDay)) {
          props.history.replace(ui.getNewPath(newDay));
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    GA.initialize('UA-85003235-1', {
      debug: !isProduction
    });
    pageView(location);

    ui.updateDay(location);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(
    () => {
      ui.updateDay(location);
      pageView(location);
    },
    [props.location.search]
  );

  React.useEffect(
    () => {
      pageView(location);
    },
    [props.location.pathname]
  );

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
        <Modal open={props.location.pathname !== '/'}>
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

export default withRouter(props => (
  <UIStateProvider>
    <PreferenceContextProvider>
      <DataContextProvider>
        <App {...props} />
      </DataContextProvider>
    </PreferenceContextProvider>
  </UIStateProvider>
));
