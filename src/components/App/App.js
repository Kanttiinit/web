// @flow
import 'babel-core/register'
import 'babel-polyfill'
import React from 'react'
import moment from 'moment'
import {withRouter, Switch, Route} from 'react-router-dom'
import GA from 'react-ga'
import key from 'keymaster'

import {uiState} from '../../store'
import css from './App.scss'
import Footer from '../Footer'
import Modal from '../Modal'
import Menus from '../Menus'
import NotFound from '../NotFound'
import PrivacyPolicy from '../PrivacyPolicy'
import Contact from '../Contact'
import Settings from '../Settings'
import AreaSelector from '../AreaSelector'
import FavoriteSelector from '../FavoriteSelector'
import RestaurantModal from '../RestaurantModal'
import ReportModal from '../ReportModal'
import Clients from '../Clients'

window.isBeta = location.hostname === 'beta.kanttiinit.fi' || location.hostname === 'localhost'

class App extends React.PureComponent {
  state = {
    rightArrowVisible: false,
    leftArrowVisible: false
  };

  componentWillMount() {
    key('left,right', (event, handler) => {
      const offset = handler.shortcut === 'left' ? -1 : 1
      const newDay = moment(uiState.day).add({day: offset})
      if (uiState.isDateInRange(newDay)) {
        this.props.history.replace(uiState.getNewPath(newDay))
      }
    })

    GA.initialize('UA-85003235-1', {
      debug: !isProduction
    })
    this.pageView(this.props)
  }

  componentWillReceiveProps(props) {
    if (props.location.search !== this.props.location.search) {
      uiState.updateDay(location)
      this.pageView(props)
    }

    if (props.location.pathname !== this.props.location.pathname) {
      this.pageView(props)
    }
  }

  pageView(props) {
    const pathname = props.location.pathname + props.location.search
    GA.set({page: pathname})
    GA.pageview(pathname)
  }

  componentDidMount() {
    uiState.updateDay(location)
  }

  render() {
    const {location} = this.props
    return (
      <div>
        <div className={css.container}>
          <Menus />
          <Footer path={location.pathname} />
        </div>
        <Switch>
          <Route exact path="/" />
          <Route path="/settings/favorites">
            <Modal><FavoriteSelector /></Modal>
          </Route>
          <Route path="/settings">
            <Modal><Settings /></Modal>
          </Route>
          <Route path="/contact">
            <Modal><Contact /></Modal>
          </Route>
          <Route path="/privacy-policy">
            <Modal><PrivacyPolicy /></Modal>
          </Route>
          <Route path="/select-area">
            <Modal><AreaSelector /></Modal>
          </Route>
          <Route path="/clients">
            <Modal><Clients /></Modal>
          </Route>
          <Route path="/restaurant/:id">
            {({match}) =>
            <Modal>
              <RestaurantModal restaurantId={match.params.id} />
            </Modal>
            }
          </Route>
          <Route path="/report/:restaurantId">
            {({match}) =>
            <Modal>
              <ReportModal restaurantId={match.params.restaurantId} />
            </Modal>
            }
          </Route>
          <Route path="*">
            <Modal><NotFound /></Modal>
          </Route>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)