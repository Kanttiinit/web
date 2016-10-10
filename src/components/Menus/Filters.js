import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import Select from 'react-select'

import AreaSelector from './AreaSelector'
import css from '../../styles/Filters.scss'
import {setFavorites} from '../../store/actions/preferences'

const Item = ({title, children}) => (
  <div className={css.item}>
    <h1>{title}</h1>
    {children}
  </div>
)

const Filters = ({favorites, selectedFavorites, setFavorites}) => (
  <div className={css.filters}>
    <Item title="Area">
      <AreaSelector />
    </Item>
    {favorites &&
    <Item title="Favorites">
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
  selectedFavorites: state.preferences.favorites
})

const mapDispatch = dispatch => bindActionCreators({setFavorites}, dispatch)

export default connect(mapState, mapDispatch)(Filters)
