import * as React from 'react'
import {observer} from 'mobx-react'
import * as Error from 'react-icons/lib/md/error'
import {times} from 'lodash'
const locating = require('../../assets/locating.svg')

import {dataStore, uiState, preferenceStore} from '../../store'
import Text from '../Text'
const css = require('./RestaurantList.scss')
import Restaurant, {Placeholder} from '../Restaurant'

@observer
export default class RestaurantList extends React.Component {
  renderContent() {
    const loading = dataStore.menus.pending || dataStore.restaurants.pending || dataStore.areas.pending
    const restaurants = dataStore.formattedRestaurants
    if (loading) {
      return times(8, i => <Placeholder key={i} />)
    } else if (preferenceStore.selectedArea === -2) {
      if (!preferenceStore.useLocation) {
        return <Text id="turnOnLocation" element="p" className="notice" />
      } else if (!uiState.location) {
        return (
          <div>
            <img src={locating} />
            <Text id="locating" element="p" className="notice" />
          </div>
        )
      }
    } else if (!restaurants.length) {
      return (
        <div className={css.emptyText}>
          <Error className="inline-icon" />&nbsp;
          <Text id="emptyRestaurants" />
        </div>
      )
    }
    return restaurants.map(restaurant =>
      <Restaurant
        key={restaurant.id}
        restaurant={restaurant} />
    )
  }

  render() {
    return (
      <div className={css.container}>
        {this.renderContent()}
      </div>
    )
  }
}