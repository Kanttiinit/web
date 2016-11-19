import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Heart from 'react-icons/lib/md/favorite'
import HeartOutline from 'react-icons/lib/md/favorite-outline'
import Back from 'react-icons/lib/md/arrow-back'
import {Link} from 'react-router'

import css from '../../styles/FavoriteSelector.scss'
import {setFavorites} from '../../store/actions/preferences'
import {selectFavorites} from '../../store/selectors'

const toggleFromFavorites = ({id}, favorites, setFavorites) => {
  const selectedIds = favorites.filter(f => f.isSelected).map(f => f.id)
  if (selectedIds.indexOf(id) > -1) {
    setFavorites(selectedIds.filter(i => i !== id))
  } else {
    setFavorites(selectedIds.concat(id))
  }
}

const FavoriteSelector = ({favorites, setFavorites}) => (
  <div className={css.modal}>
    <h1>Suosikit</h1>
    <div className={css.container}>
      {favorites.map(favorite =>
      <button
        key={favorite.id}
        className={'button ' + (favorite.isSelected ? css.selected : '')}
        onClick={() => toggleFromFavorites(favorite, favorites, setFavorites)}>
        {favorite.isSelected
        ? <Heart className="inline-icon" />
        : <HeartOutline className="inline-icon" />}
        &nbsp;
        {favorite.name}
      </button>
      )}
    </div>
  </div>
)

const mapState = state => ({
  favorites: selectFavorites(state)
})

const mapDispatch = dispatch => bindActionCreators({setFavorites}, dispatch)

export default connect(mapState, mapDispatch)(FavoriteSelector)
