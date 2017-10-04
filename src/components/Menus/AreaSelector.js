// @flow
import React from 'react'
import {observer} from 'mobx-react'
import sortBy from 'lodash/sortBy'
import Star from 'react-icons/lib/io/star'
import Map from 'react-icons/lib/md/map'
import {withRouter} from 'react-router-dom'

import {dataStore, preferenceStore} from '../../store'
import css from '../../styles/AreaSelector.scss'
import Text from '../Text'
import PageContainer from '../PageContainer'

const specialAreas = [
  {id: -2, name: <Text id="nearby" />, icon: <Map />, iconColor: '#424242'},
  {id: -1, name: <Text id="starred" />, icon: <Star style={{marginLeft: '0.4rem'}} />, iconColor: '#FFA726'}
]

@observer
class AreaSelector extends React.Component {
  selectArea(areaId: number) {
    preferenceStore.selectedArea = areaId
    this.props.history.replace('/')
  }
  getAreas() {
    return specialAreas.concat(sortBy(dataStore.areas.data, 'name'))
  }
  render() {
    return (
      <PageContainer title={<Text id="selectArea" />}>
        <div className={css.container}>
          {this.getAreas().map(area =>
          <div key={area.id} className={css.area + (preferenceStore.selectedArea === area.id ? ' ' + css.selected : '')}>
            <button
              onClick={() => this.selectArea(area.id)}
              className={'button-text ' + (preferenceStore.selectedArea === area.id ? css.selected : '')}
              key={area.id}>
              {area.icon
              ? <div className={css.icon} style={{color: area.iconColor}}>{area.icon}</div>
              : <img className={css.map} src={area.mapImageUrl} />}
              <br />
              {area.name}
            </button>
          </div>
          )}
        </div>
      </PageContainer>
    )
  }
}

export default withRouter(AreaSelector)