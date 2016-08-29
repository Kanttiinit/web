import React from 'react'
import {connect} from 'react-redux'
import ExpandLess from 'react-icons/lib/md/expand-less'
import c from 'classnames'
import Collapse from 'react-collapse'

import Restaurant from './Restaurant'
import {isAreaHidden} from '../../store/selectors'
import {setAreaHidden} from '../../store/actions/preferences'

const Restaurants = ({area, restaurants, dayOfWeek, isHidden, setHidden}) => (
  <div className={c({'area-restaurants': true, 'hidden': isHidden})}>
    <h1 onClick={() => setHidden(!isHidden)}>{area.name} <ExpandLess className="inline-icon" /></h1>
    <Collapse
      springConfig={{stiffness: 500, damping: 50}}
      isOpened={!isHidden}>
      <div className="restaurants">
        {restaurants.map(restaurant =>
        <Restaurant
          key={restaurant.id}
          restaurant={restaurant}
          dayOfWeek={dayOfWeek} />
        )}
      </div>
    </Collapse>
  </div>
)

const mapState = (state, props) => ({
  isHidden: isAreaHidden(state, props)
})

const mapDispatch = (dispatch, props) => ({
  setHidden: hidden => dispatch(setAreaHidden(props.area.id, hidden))
})

export default connect(mapState, mapDispatch)(Restaurants)
