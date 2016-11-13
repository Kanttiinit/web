import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import css from '../styles/App.scss'
import * as asyncActions from '../store/actions/async'
import {setLocation} from '../store/actions/values'
import {selectLang} from '../store/selectors'
import Footer from './Footer'
import Modal from './Modal'

class App extends React.Component {
  componentWillReceiveProps(props) {
    // if app has initialized or lang has changed, fetch all resources
    if (props.lang !== this.props.lang) {
      this.fetchAll(props.lang)
    }

    this.updateLocation(props)
  }
  updateLocation(props) {
    // start or stop watching for location
    if (props.useLocation && !this.locationWatchId) {
      this.locationWatchId = navigator.geolocation.watchPosition(({coords: {latitude, longitude}}) => {
        this.props.setLocation({latitude, longitude})
      })
    } else if (!props.useLocation) {
      navigator.geolocation.clearWatch(this.locationWatchId)
      this.locationWatchId = undefined
      this.props.setLocation()
    }
  }
  fetchAll(lang) {
    const {fetchAreas, fetchMenus, fetchRestaurants, fetchFavorites} = this.props
    fetchMenus(lang)
    fetchRestaurants(lang)
    fetchAreas(lang)
    fetchFavorites(lang)
  }
  componentDidMount() {
    this.props.fetchUser()
    .then(() => this.fetchAll(this.props.lang))
    .catch(() => this.fetchAll(this.props.lang))

    this.updateLocation(this.props)
  }
  render() {
    const {children, location} = this.props
    return (
      <div>
        <div className={css.container}>
          {children}
          <Footer path={location.pathname} />
        </div>
        <Modal />
      </div>
    )
  }
}

const mapState = state => ({
  lang: selectLang(state),
  useLocation: state.preferences.useLocation
})

const mapDispatch = dispatch => bindActionCreators({
  ...asyncActions,
  setLocation
}, dispatch)

export default connect(mapState, mapDispatch)(App)
