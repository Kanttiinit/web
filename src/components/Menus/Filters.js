import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import Select from 'react-select'

import {orders} from '../../store/actions/preferences'
import Text from '../Text'
import AreaSelector from './AreaSelector'
import css from '../../styles/Filters.scss'
import * as actions from '../../store/actions/preferences'

const Item = ({title, children}) => (
  <div className={css.item}>
    <h1>{title}</h1>
    {children}
  </div>
)

const Filters = ({favorites, selectedFavorites, setFavorites, order, setOrder}) => (
  <div className={css.filters}>
    <Item title={<Text id="order" />}>
      <Select
        style={{width: '10em'}}
        clearable={false}
        searchable={false}
        options={orders.map(order => ({
          label: <Text id={order} />,
          value: order
        }))}
        onChange={option => setOrder(option.value)}
        value={order} />
    </Item>
    <Item title={<Text id="area" />}>
      <AreaSelector />
    </Item>
    {favorites &&
    <Item title={<Text id="favorites" />}>
      <Select
        onChange={values => setFavorites(values.map(v => v.value))}
        clearable={false}
        searchable={false}
        value={selectedFavorites}
        options={sortBy(favorites, 'name').map(f => ({
          label: f.name,
          value: f.id
        }))}
        multi={true} />
    </Item>
    }
  </div>
)

const mapState = state => ({
  favorites: state.data.favorites,
  selectedFavorites: state.preferences.favorites,
  order: state.preferences.order
})

const mapDispatch = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapState, mapDispatch)(Filters)
