import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Select from 'react-select'
import Pin from 'react-icons/lib/md/room'
import Star from 'react-icons/lib/md/star'
import {Link} from 'react-router'

import {orders} from '../../store/actions/preferences'
import Text from '../Text'
import css from '../../styles/Filters.scss'
import * as actions from '../../store/actions/preferences'
import {selectSelectedArea} from '../../store/selectors'

const Filters = ({order, setOrder, selectedArea}) => (
  <div className={css.filters}>
    <Select
      style={{width: '7em'}}
      clearable={false}
      searchable={false}
      options={orders.map(order => ({
        label: <Text id={order} />,
        value: order
      }))}
      onChange={option => setOrder(option.value)}
      value={order} />
    <Link to="/select-area">
      <button className="button">
        <Pin className="inline-icon" />
        &nbsp;
        {selectedArea === -2 ? <Text id="nearby" />
        : selectedArea === -1 ? <Text id="starred" />
        : selectedArea && selectedArea.name}
      </button>
    </Link>
    <Link to="/select-favorites">
      <Text id="favorites" element="button" className="button">
        <Star className="inline-icon" />&nbsp;
      </Text>
    </Link>
  </div>
)

const mapState = state => ({
  order: state.preferences.order,
  selectedArea: selectSelectedArea(state)
})

const mapDispatch = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapState, mapDispatch)(Filters)
