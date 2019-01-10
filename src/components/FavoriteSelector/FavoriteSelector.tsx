import * as React from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

import { useFormattedFavorites } from '../../contexts/hooks';
import preferenceContext from '../../contexts/preferencesContext';
import { RoundedButton, RoundedButtonContainer } from '../Button/RoundedButton';
import InlineIcon from '../InlineIcon';

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
