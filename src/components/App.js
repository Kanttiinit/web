import React from 'react'
import { connect } from 'react-redux'

import Header from './Header'
import Footer from './Footer'

const App = ({view}) => (
  <div>
    <Header />
    {view}
    <Footer />
  </div>
)

const mapState = state => ({
  view: state.value.view
})

export default connect(mapState)(App)
