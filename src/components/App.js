import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import GA from 'react-ga'

import '../styles/App.scss'
import modalCss from '../styles/Modal.scss'
import * as asyncActions from '../store/actions/async'
import {closeModal, setLocation} from '../store/actions/values'
import {selectLang} from '../store/selectors'
import Header from './Header'
import Footer from './Footer'

class App extends React.Component {
  componentWillReceiveProps(props) {
    // if app has initialized or lang has changed, fetch all resources
    if (props.lang !== this.props.lang) {
      this.fetchAll(props.lang)
    }

    // start or stop watching for location
    if (props.useLocation !== this.props.useLocation) {
      if (props.useLocation) {
        this.locationWatchId = navigator.geolocation.watchPosition(({coords: {latitude, longitude}}) => {
          this.props.setLocation({latitude, longitude})
        })
      } else if (this.locationWatchId) {
        navigator.geolocation.clearWatch(this.locationWatchId)
        this.props.setLocation()
      }
    }

    // send pageview to google analytics if path has changed
    const path = props.location.pathname
    if (path !== this.props.location.pathname) {
      GA.set({page: path})
      GA.pageview(path)
    }
  }
  fetchAll(lang) {
    const {fetchAreas, fetchMenus, fetchRestaurants} = this.props
    fetchMenus(lang)
    fetchRestaurants(lang)
    fetchAreas(lang)
  }
  componentDidMount() {
    this.props.fetchUser()
    .then(() => this.fetchAll(this.props.lang))
    .catch(() => this.fetchAll(this.props.lang))
  }
  render() {
    const {children, modal, closeModal, location} = this.props
    return (
      <div>
        <Header />
        {children}
        <Footer path={location.pathname} />
        <div className={modalCss.container + (modal.open ? ' ' + modalCss.open : '')}>
          <div className={modalCss.overlay} onClick={() => closeModal()}></div>
          <div className={modalCss.content}>{modal.component}</div>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  lang: selectLang(state),
  modal: state.value.modal,
  useLocation: state.preferences.useLocation
})

const mapDispatch = dispatch => bindActionCreators({
  ...asyncActions,
  closeModal,
  setLocation
}, dispatch)

export default connect(mapState, mapDispatch)(App)
