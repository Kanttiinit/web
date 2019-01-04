import * as addDays from 'date-fns/add_days';
import { autorun } from 'mobx';
import * as React from 'react';
import * as GA from 'react-ga';
import { RouteComponentProps } from 'react-router';
import { Route, Switch, withRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import { preferenceStore, uiState } from '../../store';
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
  darkMode: preferenceStore.darkMode
};

class App extends React.PureComponent<RouteComponentProps<any>> {
  state = {
    leftArrowVisible: false,
    rightArrowVisible: false,
    theme: themeConstants
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
  }

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

    autorun(() => {
      this.setState({
        theme: { ...themeConstants, dark: preferenceStore.darkMode }
      });
    });
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
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
