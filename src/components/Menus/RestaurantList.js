// @flow
import React from 'react'
import {observer} from 'mobx-react'
import Error from 'react-icons/lib/md/error'
import times from 'lodash/times'
import Swipeable from 'react-swipeable'

import {dataStore, uiState, preferenceStore} from '../../store'
import Text from '../Text'
import css from '../../styles/RestaurantList.scss'
import Restaurant, {Placeholder} from './Restaurant'

const Arrow = ({direction, visiblePercentage}) => (
  <div
    className={css.arrow + ' ' + (direction === 'right' ? css.right : css.left)}
    style={{[direction]: (1 - visiblePercentage) * -75 + 'px'}}>
    {direction === 'right' ? '→' : '←'}
  </div>
)

@observer
export default class RestaurantList extends React.PureComponent {
  state = {
    rightArrowVisible: 0,
    leftArrowVisible: 0
  };
  renderContent() {
    const loading = dataStore.menus.pending || dataStore.restaurants.pending || dataStore.areas.pending
    const dayOffset = uiState.dayOffset
    const restaurants = dataStore.formattedRestaurants
    if (loading) {
      return times(6, i => <Placeholder key={i} />)
    } else if (preferenceStore.selectedArea === -2) {
      if (!preferenceStore.useLocation) {
        return <Text id="turnOnLocation" element="p" className="notice" />
      } else if (!uiState.location) {
        return <Text id="locating" element="p" className="notice" />
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
        restaurant={restaurant}
        dayOffset={dayOffset} />
    )
  }
  swiped = (direction: number) => {
    uiState.setDayOffset(uiState.dayOffset + direction)
    this.setState({
      rightArrowVisible: 0,
      leftArrowVisible: 0
    })
  }
  swiping = (direction: string) => (event: Event, amount: number) => {
    if (direction === 'left' && uiState.dayOffset > 0 || direction === 'right') {
      this.setState({[direction + 'ArrowVisible']: Math.min(1, amount / 100)})
    }
  }
  render() {
    const {leftArrowVisible, rightArrowVisible} = this.state
    return (
      <div className={css.container}>
        <Arrow
          visiblePercentage={leftArrowVisible}
          direction="left" />
        <Swipeable
          onSwipingLeft={this.swiping('left')}
          onSwipingRight={this.swiping('right')}
          onSwipedLeft={() => this.swiped(-1)}
          onSwipedRight={() => this.swiped(1)}>
          {this.renderContent()}
        </Swipeable>
        <Arrow
          visiblePercentage={rightArrowVisible}
          direction="right" />
      </div>
    )
  }
}