import * as React from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

import { preferenceContext } from '../contexts';
import { useFormattedFavorites } from '../utils/hooks';
import InlineIcon from './InlineIcon';
import { RoundedButton, RoundedButtonContainer } from './RoundedButton';

export default () => {
  const preferences = React.useContext(preferenceContext);
  const formattedFavorites = useFormattedFavorites();
  return (
    <RoundedButtonContainer>
      {formattedFavorites.map(favorite => (
        <RoundedButton
          color="var(--hearty)"
          key={favorite.id}
          selected={favorite.isSelected}
          onClick={() => preferences.toggleFavorite(favorite.id)}
        >
          <InlineIcon>
            {favorite.isSelected ? <MdFavorite /> : <MdFavoriteBorder />}
          </InlineIcon>
          &nbsp;
          {favorite.name}
        </RoundedButton>
      ))}
    </RoundedButtonContainer>
  );
};
