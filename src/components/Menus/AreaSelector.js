import React from 'react'
import {connect} from 'react-redux'
import c from 'classnames'
import sortBy from 'lodash/sortBy'

import {setSelectedArea} from '../../store/actions/preferences'

const AreaSelector = ({areas, selectedArea, setSelectedArea}) => (
  <div>
    {sortBy(areas, 'name').map(area =>
    <button
      className={c({selected: area.id === selectedArea})}
      onClick={() => setSelectedArea(area.id)}>
      {area.name}
    </button>
    )}
  </div>
)

const mapState = state => ({
  areas: state.data.areas || [],
  selectedArea: state.preferences.selectedArea
})

const mapDispatch = dispatch => ({
  setSelectedArea: areaId => dispatch(setSelectedArea(areaId))
})

export default connect(mapState, mapDispatch)(AreaSelector)
