// @flow
import 'babel-core/register'
import 'babel-polyfill'
import React from 'react'
import {withRouter, Switch, Route} from 'react-router-dom'
import GA from 'react-ga'
import key from 'keymaster'

import {uiState} from '../store'
import css from '../styles/App.scss'
import Footer from './Footer'
import Modal from './Modal'
import Menus from './Menus'
import NotFound from './NotFound'
import PrivacyPolicy from './PrivacyPolicy'
import Contact from './Contact'
import Settings from './Menus/Settings'
import AreaSelector from './Menus/AreaSelector'
import FavoriteSelector from './Menus/FavoriteSelector'
import RestaurantModal from './RestaurantModal'

window.isBeta = location.hostname === 'beta.kanttiinit.fi' || location.hostname === 'localhost'

class App extends React.PureComponent {
  state = {
    rightArrowVisible: false,
    leftArrowVisible: false
  };

  componentWillMount() {
    key('left,right', (event, handler) => {
      const offset = handler.shortcut === 'left' ? -1 : 1
      uiState.moveDayBy(offset)
    })

    GA.initialize('UA-85003235-1', {
      debug: !isProduction
    })
  }

  componentWillReceiveProps(props) {
    if (props.location.search !== this.props.location.search) {
      uiState.updateDay(location)
    }

    if (props.location.pathname !== this.props.location.pathname) {
      const pathname = props.location.pathname
      GA.set({page: pathname})
      GA.pageview(pathname)
    }
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
          <Route path="/restaurant/:id">
            {({match}) =>
            <Modal><RestaurantModal restaurantId={match.params.id} /></Modal>
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