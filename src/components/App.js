import React from 'react'
import { connect } from 'react-redux'

import DaySelector from './DaySelector'

class App extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className="app">
        <h1>Hei, tänään on päivä {this.props.dayOffset}</h1>
        <DaySelector />
        {this.props.loading ? null : JSON.stringify(this.props.restaurants)}
      </div>
    )
  }
}

const mapState = (state, props) => ({
  loading: state.pending.restaurants,
  restaurants: state.data.restaurants,
  dayOffset: state.value.dayOffset
});

App = connect(mapState)(App)

export default App
