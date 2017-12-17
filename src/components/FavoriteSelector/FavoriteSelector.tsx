import * as React from 'react'
import * as Heart from 'react-icons/lib/md/favorite'
import * as HeartOutline from 'react-icons/lib/md/favorite-outline'
import {observer} from 'mobx-react'

import {dataStore, preferenceStore} from '../../store'
const css = require('./FavoriteSelector.scss')

export default observer(() => (
  <div className={css.container}>
    {dataStore.formattedFavorites.map(favorite =>
    <button
      key={favorite.id}
      className={'button ' + (favorite.isSelected ? css.selected : '') + ' ' + css.roundedButton}
      onClick={() => preferenceStore.toggleFavorite(favorite.id)}>
      {favorite.isSelected
      ? <Heart className="inline-icon" />
      : <HeartOutline className="inline-icon" />}
      &nbsp;
      {favorite.name}
    </button>
    )}
  </div>
))
