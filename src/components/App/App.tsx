import * as React from 'react';
import * as moment from 'moment';
import { withRouter, Switch, Route } from 'react-router-dom';
import * as GA from 'react-ga';

import { uiState } from '../../store';
import * as css from './App.scss';
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
import { isProduction } from '../../utils/consts';
import { RouteComponentProps } from 'react-router';

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
      const newDay = moment(uiState.selectedDay).add({ day: offset });
      if (uiState.isDateInRange(newDay)) {
        this.props.history.replace(uiState.getNewPath(newDay));
      }
    }
  };

  componentDidUpdate(props: RouteComponentProps<any>) {
    if (props.location.search !== this.props.location.search) {
      uiState.updateDay(location);
      this.pageView(props);
    }

    if (props.location.pathname !== this.props.location.pathname) {
      this.pageView(props);
    }
  }

  pageView(props) {
    const pathname = props.location.pathname + props.location.search;
    GA.set({ page: pathname });
    GA.pageview(pathname);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);

    GA.initialize('UA-85003235-1', {
      debug: !isProduction
    });
    this.pageView(this.props);

    uiState.updateDay(location);
  }

  render() {
    return (
      <React.Fragment>
        <div className={css.container}>
          <div>
            <TopBar />
            <RestaurantList />
          </div>
          <Footer />
        </div>
        <Switch>
          <Route exact path="/" />
          <Route path="/settings/favorites">
            <Modal>
              <FavoriteSelector />
            </Modal>
          </Route>
          <Route path="/settings">
            <Modal>
              <Settings />
            </Modal>
          </Route>
          <Route path="/contact">
            <Modal>
              <Contact />
            </Modal>
          </Route>
          <Route path="/terms-of-service">
            <Modal>
              <TermsOfService />
            </Modal>
          </Route>
          <Route path="/select-area">
            <Modal>
              <AreaSelector />
            </Modal>
          </Route>
          <Route path="/clients">
            <Modal>
              <Clients />
            </Modal>
          </Route>
          <Route path="/updates">
            <Modal>
              <ChangeLog />
            </Modal>
          </Route>
          <Route path="/restaurant/:id">
            {({ match }) => (
              <Modal>
                <RestaurantModal restaurantId={match.params.id} />
              </Modal>
            )}
          </Route>
          <Route path="/report/:restaurantId">
            {({ match }) => (
              <Modal>
                <ReportModal restaurantId={match.params.restaurantId} />
              </Modal>
            )}
          </Route>
          <Route path="*">
            <Modal>
              <NotFound />
            </Modal>
          </Route>
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
