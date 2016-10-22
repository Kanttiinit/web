import React from 'react'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import Star from 'react-icons/lib/io/star'
import Map from 'react-icons/lib/md/map'
import {browserHistory} from 'react-router'

import css from '../../styles/AreaSelector.scss'
import Text from '../Text'
import {openModal} from '../../store/actions/values'
import {setSelectedArea} from '../../store/actions/preferences'

const specialAreas = [
  {id: -2, name: <Text id="nearby" />, icon: <Map className="inline-icon" />},
  {id: -1, name: <Text id="starred" />, icon: <Star className="inline-icon" />}
]

export const AreaSelector = ({areas, selectedArea, setSelectedArea}) => (
  <div className={css.modal}>
    <span className={css.title}>Valitse näkyvät alueet</span>
    <div className={css.container}>
      {specialAreas.concat(sortBy(areas, 'name')).map(area =>
      <div className={css.area + (selectedArea === area.id ? ' ' + css.selected : '')}>
      <button
        onClick={() => {setSelectedArea(area.id); browserHistory.replace('/')}}
        className={'button ' + (selectedArea === area.id ? css.selected : '')}
        key={area.id}>
          {area.icon
          ? <div className={css.map}>{area.icon}</div>
          : <img className={css.map} src={area.mapImageUrl} />}
          {area.name}
        </button>
      </div>
      )}
    </div>
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
