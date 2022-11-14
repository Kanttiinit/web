import { For } from 'solid-js';
import { formattedFavorites, getArrayWithToggled } from '../utils';
import InlineIcon from './InlineIcon';
import { RoundedButton, RoundedButtonContainer } from './RoundedButton';
import { setState, state } from '../state';
import { FilledHeartIcon, HeartIcon } from '../icons';

export default function FavoriteSelector() {
  return (
    <RoundedButtonContainer>
      <For each={formattedFavorites()}>
        {favorite => (
          <RoundedButton
            color="var(--hearty)"
            selected={favorite.isSelected}
            onClick={() =>
              setState(
                'preferences',
                'favorites',
                getArrayWithToggled(state.preferences.favorites, favorite.id)
              )
            }
          >
            <InlineIcon>
              {favorite.isSelected ? <FilledHeartIcon /> : <HeartIcon />}
            </InlineIcon>
            &nbsp;
            {favorite.name}
          </RoundedButton>
        )}
      </For>
    </RoundedButtonContainer>
  );
}
