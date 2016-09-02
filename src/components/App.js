import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import {fetchAreas, fetchMenus, fetchRestaurants, fetchFavorites, fetchLocation} from '../store/actions/async'
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
  }
  fetchAll(lang) {
    const {fetchAreas, fetchMenus, fetchRestaurants, fetchFavorites} = this.props
    fetchAreas(lang)
    fetchMenus(lang)
    fetchRestaurants(lang)
    fetchFavorites(lang)
  }
  componentDidMount() {
    document.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        this.props.closeModal()
      }
    })
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
  useLocation: state.preferences.useLocation
})

const mapDispatch = dispatch => bindActionCreators({
  fetchAreas,
  fetchMenus,
  fetchRestaurants,
  fetchFavorites,
  fetchLocation,
  closeModal
}, dispatch)

export default connect(mapState, mapDispatch)(App)
