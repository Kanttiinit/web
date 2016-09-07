import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import * as asyncActions from '../store/actions/async'
import {closeModal} from '../store/actions/values'
import {selectLang} from '../store/selectors'
import Header from './Header'
import Footer from './Footer'

class App extends React.Component {
  componentWillReceiveProps(props) {
    if ((!props.initializing && this.props.initializing) || props.lang !== this.props.lang) {
      this.fetchAll(props.lang)
    }

    if (props.useLocation && props.useLocation !== this.props.useLocation) {
      this.props.fetchLocation()
    }

    if (props.authData !== this.props.authData) {
      if (props.authData) {
        this.props.fetchUser(props.authData)
      }
    }
  }
  fetchAll(lang) {
    const {fetchAreas, fetchMenus, fetchRestaurants, fetchFavorites} = this.props
    fetchAreas(lang)
    fetchMenus(lang)
    fetchRestaurants(lang)
    fetchFavorites(lang)
  }
  render() {
    const {view, initializing, modal, closeModal} = this.props
    if (initializing)
      return null
    return (
      <div>
        <Header />
        {view}
        <Footer />
        <div className={'modal' + (modal.open ? ' open' : '')}>
          <div className="modal-overlay" onClick={() => closeModal()}></div>
          <div className="modal-content">{modal.component}</div>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  initializing: state.value.initializing,
  view: state.value.view.view,
  lang: selectLang(state),
  modal: state.value.modal,
  useLocation: state.preferences.useLocation,
  authData: state.preferences.authData
})

const mapDispatch = dispatch => bindActionCreators({
  ...asyncActions,
  closeModal
}, dispatch)

export default connect(mapState, mapDispatch)(App)
