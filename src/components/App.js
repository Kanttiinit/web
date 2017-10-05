// @flow
import 'babel-core/register'
import 'babel-polyfill'
import React from 'react'
// import classnames from 'classnames'
// import Left from 'react-icons/lib/md/arrow-back'
// import Right from 'react-icons/lib/md/arrow-forward'
import {withRouter, Switch, Route} from 'react-router-dom'
import GA from 'react-ga'
import key from 'keymaster'

import http from '../utils/http'
import {uiState, dataStore} from '../store'
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

// const Arrow = ({direction, visible}) => (
//   <div
//     className={classnames(css.arrow, visible && css.arrowVisible, direction === 'right' ? css.right : css.left)}>
//     {direction === 'right' ? <Right /> : <Left />}
//   </div>
// )

class App extends React.PureComponent {
  state = {
    rightArrowVisible: false,
    leftArrowVisible: false
  };
  // swiped = (direction: number) => {
  //   uiState.setDayOffset(uiState.dayOffset + direction)
  //   this.setState({
  //     rightArrowVisible: false,
  //     leftArrowVisible: false
  //   })
  // }
  // swiping = (direction: string) => (event: Event, amount: number) => {
  //   const canGoLeft = uiState.dayOffset > 0 || direction === 'right'
  //   const canGoRight = uiState.dayOffset !== uiState.maxDayOffset
  //   if (direction === 'left' && canGoLeft || direction === 'right' && canGoRight) {
  //     this.setState({[direction + 'ArrowVisible']: Math.min(1, amount / 100)})
  //   }
  // }
  async parseAuth() {
    const {hash, search} = window.location
    const accessTokenRegexp = /#access_token\=([^&]+)/
    const accessTokenMatch = hash.match(accessTokenRegexp)
    if (accessTokenMatch) {
      const provider = search.match(/\?facebook/) ? 'facebook' : 'google'
      this.props.history.push(location.pathname)
      await http.post('/me/login', {
        provider,
        token: accessTokenMatch[1]
      })
      await dataStore.fetchUser()
    }
  }
  componentWillMount() {
    key('left,right', (event, handler) => {
      const offset = handler.shortcut === 'left' ? -1 : 1
      uiState.setDayOffset(uiState.dayOffset + offset)
    })

    this.parseAuth()

    GA.initialize('UA-85003235-1', {
      debug: !isProduction
    })
    this.pageView(this.props)
  }
  componentWillReceiveProps(props) {
    if (props.location.pathname !== this.props.location.pathname || props.location.search !== this.props.location.search) {
      this.pageView(props)
    }
  }
  pageView(props) {
    const pathname = props.location.pathname + props.location.search
    GA.set({page: pathname})
    GA.pageview(pathname)
  }
  render() {
    const {location} = this.props
    // const {leftArrowVisible, rightArrowVisible} = this.state
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