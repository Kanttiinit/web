// @flow
import React from 'react'
import {observer} from 'mobx-react'
import Error from 'react-icons/lib/md/error'
import times from 'lodash/times'

import {dataStore, uiState} from '../../store'
import Text from '../Text'
import css from '../../styles/RestaurantList.scss'
import Restaurant, {Placeholder} from './Restaurant'

@observer
export default class RestaurantList extends React.PureComponent {
  render() {
    const loading = dataStore.menus.pending || dataStore.restaurants.pending || dataStore.areas.pending
    const dayOffset = uiState.dayOffset
    const restaurants = dataStore.formattedRestaurants
    return (
      <div className={css.container}>
        {loading ? times(6, i => <Placeholder key={i} />)
        : !restaurants.length?
          <div className={css.emptyText}>
            <Error className="inline-icon" />&nbsp;
            <Text id="emptyRestaurants" />
          </div>
        : restaurants.map(restaurant =>
        {/*<Restaurant
          key={restaurant.id}
          restaurant={restaurant}
          dayOffset={dayOffset} />*/}
        )}
      </div>
    )
  }
}