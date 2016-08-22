import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import {fetchAreas, fetchMenus, fetchRestaurants, fetchFavorites} from '../store/actions/async'
import {selectLang} from '../store/selectors'
import Header from './Header'
import Footer from './Footer'

class App extends React.Component {
  componentWillReceiveProps(props) {
    if (props.initializing === false || props.lang !== this.props.lang) {
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
    const {view} = this.props
    return (
      <div>
        <Header />
        {view}
        <Footer />
      </div>
    )
  }
}

const mapState = state => ({
  initializing: state.value.initializing,
  view: state.value.view.view,
  lang: selectLang(state)
})

const mapDispatch = dispatch => bindActionCreators({
  fetchAreas,
  fetchMenus,
  fetchRestaurants,
  fetchFavorites
}, dispatch)

export default connect(mapState, mapDispatch)(App)
