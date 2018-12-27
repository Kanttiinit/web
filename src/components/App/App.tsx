import * as React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import * as GA from 'react-ga';
import * as addDays from 'date-fns/add_days';
import styled, { ThemeProvider } from 'styled-components';

import { uiState, preferenceStore } from '../../store';
import Footer from '../Footer';
import Modal from '../Modal';
import TopBar from '../TopBar';
import RestaurantList from '../RestaurantList';
import NotFound from '../NotFound';
import TermsOfService from '../TermsOfService';
import Contact from '../Contact';
import Settings from '../Settings';
import AreaSelector from '../AreaSelector';
import FavoriteSelector from '../FavoriteSelector';
import RestaurantModal from '../RestaurantModal';
import ReportModal from '../ReportModal';
import Clients from '../Clients';
import ChangeLog from '../ChangeLog';
import { isProduction, version } from '../../utils/consts';
import { RouteComponentProps } from 'react-router';
import AssetsLoading from '../AssetsLoading';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const themeConstants = {
  breakSmall: '767px'
};

class App extends React.PureComponent<RouteComponentProps<any>> {
  state = {
    rightArrowVisible: false,
    leftArrowVisible: false
  };

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const offset = e.key === 'ArrowLeft' ? -1 : 1;
      const newDay = addDays(uiState.selectedDay, offset);
      if (uiState.isDateInRange(newDay)) {
        this.props.history.replace(uiState.getNewPath(newDay));
      }
    }
  };

  componentDidUpdate(props: RouteComponentProps<any>) {
    if (props.location.search !== this.props.location.search) {
      uiState.updateDay(location);
      this.pageView();
    }

    if (props.location.pathname !== this.props.location.pathname) {
      this.pageView();
    }
  }

  pageView() {
    const pathname = this.props.location.pathname + this.props.location.search;
    GA.set({ page: pathname, 'App Version': version });
    GA.pageview(pathname);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);

    GA.initialize('UA-85003235-1', {
      debug: !isProduction
    });
    this.pageView();

    uiState.updateDay(location);
  }

  render() {
    return (
      <ThemeProvider
        theme={{ ...themeConstants, dark: preferenceStore.darkMode }}
      >
        <React.Fragment>
          <Container>
            <div>
              <TopBar />
              <RestaurantList />
            </div>
            <Footer />
          </Container>
          <Modal open={this.props.location.pathname !== '/'}>
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
  }
}

export default withRouter(App);
