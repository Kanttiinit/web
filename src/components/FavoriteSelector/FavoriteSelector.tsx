import * as React from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { observer } from 'mobx-react';

import { dataStore, preferenceStore } from '../../store';
import { RoundedButtonContainer, RoundedButton } from '../Button/RoundedButton';

export default observer(() => (
  <RoundedButtonContainer>
    {dataStore.formattedFavorites.map(favorite => (
      <RoundedButton
        color="var(--hearty)"
        key={favorite.id}
        selected={favorite.isSelected}
        onClick={() => preferenceStore.toggleFavorite(favorite.id)}
      >
        {favorite.isSelected ? (
          <MdFavorite className="inline-icon" />
        ) : (
          <MdFavoriteBorder className="inline-icon" />
        )}
        &nbsp;
        {favorite.name}
      </RoundedButton>
    ))}
  </RoundedButtonContainer>
));
