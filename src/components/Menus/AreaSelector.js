import React from 'react'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import Star from 'react-icons/lib/io/star'

import {setSelectedArea} from '../../store/actions/preferences'
import Radio from '../Radio'

const AreaSelector = ({areas, selectedArea, setSelectedArea, style}) => {
  const options = [{
    label: <span><Star className="inline-icon" /></span>,
    value: -1
  }].concat(sortBy(areas, 'name').map(area =>
    ({label: area.name, value: area.id})
  ))
  return (
    <Radio
      style={style}
      options={options}
      onChange={areaId => setSelectedArea(areaId)}
      selected={selectedArea} />
  )
}

const mapState = state => ({
  areas: state.data.areas || [],
  selectedArea: state.preferences.selectedArea
})

const mapDispatch = dispatch => ({
  setSelectedArea: areaId => dispatch(setSelectedArea(areaId))
})

export default connect(mapState, mapDispatch)(AreaSelector)
