import React from 'react'
import { connect } from 'react-redux'

import DaySelector from './DaySelector'

const App = ({ dayOffset, restaurants, loading }) => (
   <div className="app">
     <h1>Hei, tänään on päivä {dayOffset}</h1>
     <DaySelector />
     {loading ? <p>Loading...</p> : JSON.stringify(restaurants)}
   </div>
 )

const mapState = state => ({
  loading: state.pending.restaurants,
  restaurants: state.data.restaurants,
  dayOffset: state.value.dayOffset
});

export default connect(mapState)(App)
