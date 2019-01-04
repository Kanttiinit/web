import { observer } from 'mobx-react';
import * as React from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

import { dataStore, preferenceStore } from '../../store';
import { RoundedButton, RoundedButtonContainer } from '../Button/RoundedButton';
import InlineIcon from '../InlineIcon';

export default observer(() => (
  <RoundedButtonContainer>
    {dataStore.formattedFavorites.map(favorite => (
      <RoundedButton
        color="var(--hearty)"
        key={favorite.id}
        selected={favorite.isSelected}
        onClick={() => preferenceStore.toggleFavorite(favorite.id)}
      >
        <InlineIcon>
          {favorite.isSelected ? <MdFavorite /> : <MdFavoriteBorder />}
        </InlineIcon>
        &nbsp;
        {favorite.name}
      </RoundedButton>
    ))}
  </RoundedButtonContainer>
));
