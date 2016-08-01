import React from 'react'
import { connect } from 'react-redux'

import DaySelector from './DaySelector'
import Restaurants from './Restaurants'

const App = ({ dayOffset }) => (
   <div className="app">
     <h1>Hei, tänään on päivä {dayOffset}</h1>
     <DaySelector />
     <Restaurants />
   </div>
 )

const mapState = state => ({
  dayOffset: state.value.dayOffset
})

export default connect(mapState)(App)
