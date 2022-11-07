import { For } from 'solid-js';
import { formattedFavorites } from '../utils/hooks';
import InlineIcon from './InlineIcon';
import { RoundedButton, RoundedButtonContainer } from './RoundedButton';

export default function FavoriteSelector() {
  return (
    <RoundedButtonContainer>
      <For each={formattedFavorites()}>
        {favorite =>
          <RoundedButton
            color="var(--hearty)"
            selected={favorite.isSelected}
            onClick={() => preferences.toggleFavorite(favorite.id)}
          >
            <InlineIcon>
              {/* {favorite.isSelected ? <MdFavorite /> : <MdFavoriteBorder />} */}
            </InlineIcon>
            &nbsp;
            {favorite.name}
          </RoundedButton>
        }
      </For>
    </RoundedButtonContainer>
  );
};
