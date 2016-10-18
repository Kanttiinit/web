import React from 'react'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import Star from 'react-icons/lib/io/star'
import Map from 'react-icons/lib/io/map'
import {browserHistory} from 'react-router'
import 'react-select/dist/react-select.css'

import css from '../../styles/AreaSelector.scss'
import Text from '../Text'
import {openModal} from '../../store/actions/values'
import {setSelectedArea} from '../../store/actions/preferences'

const specialAreas = [
  {id: -2, name: <span><Map className="inline-icon" /> <Text id="nearby" /></span>},
  {id: -1, name: <span><Star className="inline-icon" /> <Text id="starred" /></span>}
]

export const AreaSelector = ({areas, selectedArea, setSelectedArea}) => (
  <div className={css.modal}>
    {specialAreas.concat(sortBy(areas, 'name')).map(area =>
    <button
      onClick={() => {setSelectedArea(area.id); browserHistory.replace('/')}}
      className={'button ' + (selectedArea === area.id ? css.selected : '')}
      key={area.id}>
      {area.name}
    </button>
    )}
  </div>
)

const mapState = state => ({
  areas: state.data.areas || [],
  selectedArea: state.preferences.selectedArea,
  useLocation: state.preferences.useLocation
})

const mapDispatch = dispatch => ({
  setSelectedArea: areaId => dispatch(setSelectedArea(areaId)),
  openModal(component) {
    dispatch(openModal(component))
  }
})

export default connect(mapState, mapDispatch)(AreaSelector)
