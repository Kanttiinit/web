import React from 'react'
import {connect} from 'react-redux'
import c from 'classnames'
import sortBy from 'lodash/sortBy'

import {setSelectedArea} from '../../store/actions/preferences'
import Radio from '../Radio'
import Text from '../Text'

const AreaSelector = ({areas, selectedArea, setSelectedArea, style}) => (
  <Radio
    style={style}
    options={sortBy(areas, 'name').map(area =>
      ({label: area.name, value: area.id})
    )}
    onChange={areaId => setSelectedArea(areaId)}
    selected={selectedArea} />
)

const mapState = state => ({
  areas: state.data.areas || [],
  selectedArea: state.preferences.selectedArea
})

const mapDispatch = dispatch => ({
  setSelectedArea: areaId => dispatch(setSelectedArea(areaId))
})

export default connect(mapState, mapDispatch)(AreaSelector)
