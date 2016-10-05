import React from 'react'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import Star from 'react-icons/lib/io/star'
import Map from 'react-icons/lib/io/map'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

import Text from '../Text'
import {setSelectedArea} from '../../store/actions/preferences'

const AreaSelector = ({areas, selectedArea, useLocation, setSelectedArea, width = '15em'}) => {
  let options = []
  if (useLocation) {
    options = options.concat({
      label: <span><Map className="inline-icon" /> <Text id="nearby" /></span>,
      value: -2
    })
  }
  options = options.concat({
    label: <span><Star className="inline-icon" /> <Text id="starred" /></span>,
    value: -1
  })
  options = options.concat(sortBy(areas, 'name').map(area =>
    ({label: area.name, value: area.id})
  ))
  return (
    <div style={{display: 'inline-block', width, textAlign: 'left'}}>
      <Select
        style={{textAlign: 'center'}}
        options={options}
        clearable={false}
        onChange={({value}) => setSelectedArea(value)}
        value={selectedArea} />
    </div>
  )
}

const mapState = state => ({
  areas: state.data.areas || [],
  selectedArea: state.preferences.selectedArea,
  useLocation: state.preferences.useLocation
})

const mapDispatch = dispatch => ({
  setSelectedArea: areaId => dispatch(setSelectedArea(areaId))
})

export default connect(mapState, mapDispatch)(AreaSelector)
