import React from 'react'
import {connect} from 'react-redux'
import c from 'classnames'
import sortBy from 'lodash/sortBy'

import Radio from '../Radio'
import {setSelectedArea} from '../../store/actions/preferences'

const AreaSelector = ({areas, selectedArea, setSelectedArea}) => (
  <Radio
    options={sortBy(areas, 'name').map(area =>
      ({label: area.name, value: area.id})
    )}
    onChange={areaId => setSelectedArea(areaId)}
    selected={selectedArea}
    style={{textAlign: 'center', margin: '1.5rem 0 0.5rem'}} />
)

const mapState = state => ({
  areas: state.data.areas || [],
  selectedArea: state.preferences.selectedArea
})

const mapDispatch = dispatch => ({
  setSelectedArea: areaId => dispatch(setSelectedArea(areaId))
})

export default connect(mapState, mapDispatch)(AreaSelector)
