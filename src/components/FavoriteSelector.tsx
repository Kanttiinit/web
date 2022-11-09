import { For } from 'solid-js';
import { formattedFavorites, getArrayWithToggled } from '../utils/hooks';
import InlineIcon from './InlineIcon';
import { VsHeart, VsHeartFilled } from 'solid-icons/vs'
import { RoundedButton, RoundedButtonContainer } from './RoundedButton';
import { setState, state } from '../state';

export default function FavoriteSelector() {
  return (
    <RoundedButtonContainer>
      <For each={formattedFavorites()}>
        {favorite =>
          <RoundedButton
            color="var(--hearty)"
            selected={favorite.isSelected}
            onClick={() => setState('preferences', 'favorites', getArrayWithToggled(state.preferences.favorites, favorite.id))}
          >
            <InlineIcon>
              {favorite.isSelected ? <VsHeartFilled /> : <VsHeart />}
            </InlineIcon>
            &nbsp;
            {favorite.name}
          </RoundedButton>
        }
      </For>
    </RoundedButtonContainer>
  );
};
