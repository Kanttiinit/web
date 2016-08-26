import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import {fetchAreas, fetchMenus, fetchRestaurants, fetchFavorites} from '../store/actions/async'
import {closeModal} from '../store/actions/values'
import {selectLang} from '../store/selectors'
import Header from './Header'
import Footer from './Footer'

class App extends React.Component {
  componentWillReceiveProps(props) {
    if ((!props.initializing && this.props.initializing) || props.lang !== this.props.lang) {
      this.fetchAll(props.lang)
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
  modal: state.value.modal
})

const mapDispatch = dispatch => bindActionCreators({
  fetchAreas,
  fetchMenus,
  fetchRestaurants,
  fetchFavorites,
  closeModal
}, dispatch)

export default connect(mapState, mapDispatch)(App)
