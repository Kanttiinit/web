import * as React from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { observer } from 'mobx-react';

import { dataStore, preferenceStore } from '../../store';
import * as css from './FavoriteSelector.scss';

export default observer(() => (
  <div className={css.container}>
    {dataStore.formattedFavorites.map(favorite => (
      <button
        key={favorite.id}
        className={
          'button ' +
          (favorite.isSelected ? css.selected : '') +
          ' ' +
          css.roundedButton
        }
        onClick={() => preferenceStore.toggleFavorite(favorite.id)}
      >
        {favorite.isSelected ? (
          <MdFavorite className="inline-icon" />
        ) : (
          <MdFavoriteBorder className="inline-icon" />
        )}
        &nbsp;
        {favorite.name}
      </button>
    ))}
  </div>
));
