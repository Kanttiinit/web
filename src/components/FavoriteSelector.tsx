import { For } from 'solid-js';
import { FilledHeartIcon, HeartIcon } from '../icons';
import { setState, state } from '../state';
import { formattedFavorites, getArrayWithToggled } from '../utils';
import InlineIcon from './InlineIcon';
import { RoundedButton, RoundedButtonContainer } from './RoundedButton';

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
                getArrayWithToggled(state.preferences.favorites, favorite.id),
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
