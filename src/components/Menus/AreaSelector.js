// @flow
import React from 'react'
import {observer} from 'mobx-react'
import sortBy from 'lodash/sortBy'
import Star from 'react-icons/lib/io/star'
import Map from 'react-icons/lib/md/map'
import {browserHistory} from 'react-router'

import {dataStore, preferenceStore} from '../../store'
import css from '../../styles/AreaSelector.scss'
import Text from '../Text'
import PageContainer from '../PageContainer'

const specialAreas = [
  {id: -2, name: <Text id="nearby" />, icon: <Map />},
  {id: -1, name: <Text id="starred" />, icon: <Star style={{marginLeft: '0.4rem'}} />}
]

@observer
export default class AreaSelector extends React.PureComponent {
  selectArea(areaId: number) {
    preferenceStore.selectedArea = areaId
    browserHistory.replace('/')
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
              ? <div className={css.icon}>{area.icon}</div>
              : <img className={css.map} src={area.mapImageUrl} />}
              {area.name}
            </button>
          </div>
          )}
        </div>
      </PageContainer>
    )
  }
}