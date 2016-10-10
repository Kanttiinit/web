import React from 'react'
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import {StickyContainer, Sticky} from 'react-sticky'
import Select from 'react-select'
import sortBy from 'lodash/sortBy'

import css from '../../styles/Menus.scss'
import DaySelector from './DaySelector'
import AreaSelector from './AreaSelector'
import Loader from '../Loader'
import {getFormattedRestaurants, selectFiltersExpanded} from '../../store/selectors'
import {setFavorites} from '../../store/actions/preferences'
import RestaurantList from './RestaurantList'

const Menus = ({restaurants, dayOffset, loading, filtersExpanded, favorites, selectedFavorites, setFavorites}) => {
  const dayOfWeek = moment().add(dayOffset, 'day').locale('fi').weekday()
  return (
    <StickyContainer>
      <Sticky style={{zIndex: 1}}>
        <DaySelector />
      </Sticky>
      {filtersExpanded &&
      <div className={css.filters}>
        <AreaSelector />
        {favorites &&
        <div style={{display: 'inline-block', width: '10em'}}>
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
        </div>
        }
      </div>
      }
      {loading ? <Loader /> :
      <RestaurantList
        restaurants={restaurants}
        dayOffset={dayOffset}
        dayOfWeek={dayOfWeek} />
      }
    </StickyContainer>
  )
}

const mapState = state => ({
  loading: !state.data.menus || !state.data.restaurants || !state.data.areas,
  restaurants: getFormattedRestaurants(state),
  dayOffset: state.value.dayOffset,
  filtersExpanded: selectFiltersExpanded(state),
  favorites: state.data.favorites,
  selectedFavorites: state.preferences.favorites
})

const mapDispatch = dispatch => bindActionCreators({setFavorites}, dispatch)

export default connect(mapState, mapDispatch)(Menus)
