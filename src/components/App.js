import React from 'react'
import { connect } from 'react-redux'

import DaySelector from './DaySelector'
import Restaurants from './Restaurants'

const App = () => (
   <div className="app">
     <DaySelector />
     <Restaurants />
   </div>
 )

export default connect()(App)
