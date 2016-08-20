import React from 'react'
import { connect } from 'react-redux'

import Header from './Header'
import Restaurants from './Restaurants'
import Footer from './Footer'

const App = () => (
  <div>
    <Header />
    <Restaurants />
    <Footer />
  </div>
)

export default connect()(App)
