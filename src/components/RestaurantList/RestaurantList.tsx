import locating from '../../assets/locating.svg';

import { styled } from 'solid-styled-components';
import InlineIcon from '../InlineIcon';
import NetworkStatus from '../NetworkStatus';
import Notice from '../Notice';
import Restaurant, { Placeholder } from '../Restaurant';
import { breakLarge, breakSmall } from '../../globalStyles';
import { For, Match, Switch } from 'solid-js';
import { computedState, state, resources } from '../../state';
import { WarningIcon } from '../../icons';
import { useFormattedRestaurants } from '../../hooks';

const Container = styled.main`
  padding: 4rem 0 1.5rem;

  @media (max-width: ${breakSmall}) {
    padding-top: 3.5rem;
  }

  @media (min-width: ${breakLarge}) {
    max-width: 95em;
    margin: 0 auto;
  }
`;

const ListContainer = styled.div`
  display: flex;

  @media (max-width: ${breakSmall}) {
    max-width: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  @media (min-width: ${breakLarge}) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Locating = styled.div`
  text-align: center;
  flex: 1;

  img {
    max-width: 15rem;
  }
`;

function ListContent() {
  const loading = () => resources.menus[0].loading || resources.restaurants[0].loading || resources.areas[0].loading;
  const restaurants = useFormattedRestaurants;

  return (
    <Switch>
      <Match when={loading()}>
        {Array(8).fill(0).map(() => <Placeholder />)}
      </Match>
      <Match when={state.preferences.selectedArea === -2 && !state.preferences.useLocation}>
        <Notice>
          <InlineIcon>
            <WarningIcon />
          </InlineIcon>{' '}
          {computedState.translations().turnOnLocation()}
        </Notice>
      </Match>
      <Match when={state.preferences.selectedArea === -2 && !state.location}>
        <Locating>
          <img src={locating} />
          <Notice>{computedState.translations().locating}</Notice>
        </Locating>
      </Match>
      <Match when={!restaurants().length}>
        <Notice>
          <InlineIcon>
            <WarningIcon />
          </InlineIcon>{' '}
          {computedState.translations().emptyRestaurants}
        </Notice>
      </Match>
      <Match when={true}>
        <For each={restaurants()}>
          {restaurant => <Restaurant restaurant={restaurant} />}
        </For>
      </Match>
    </Switch>
  );
}

export default () => (
  <Container>
    <NetworkStatus />
    <ListContainer>
      <ListContent />
    </ListContainer>
  </Container>
);
