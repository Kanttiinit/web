import locating from '../assets/locating.svg';

import { styled } from 'solid-styled-components';
import InlineIcon from './InlineIcon';
import NetworkStatus from './NetworkStatus';
import Notice from './Notice';
import Restaurant, { Placeholder } from './Restaurant';
import { breakLarge, breakSmall } from '../globalStyles';
import { For, Match, Switch, createSignal } from 'solid-js';
import { computedState, state, resources } from '../state';
import { WarningIcon } from '../icons';
import { useFormattedRestaurants } from '../utils';

const MakeItStopButton = styled.button`
  background-color: tomato;
  border-radius: 1rem;
  border: none;
  color: white;
  font-size: 20pt;
  padding: 0.5rem 1rem;
  max-width: 180px;
  position: fixed;
  top: 1rem;
  margin: auto;
  right: 1rem;
  left: 1rem;
  z-index: 1000;

  &:hover,
  &:focus {
    top: 0.5rem;
    transition: top 0.2s ease;
  }

  cursor: pointer;
  animation: fadeInDown 0.6s ease-out;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ContribModal = styled.div`
  background-color: var(--gray6);
  border-radius: 0.8rem;
  border: 1px var(--gray6) solid;
  box-shadow: 0rem 0.1rem 0.6rem -0.2rem rgba(0, 0, 0, 0.3);
  color: var(--gray1);
  font-size: 16pt;
  padding: 0.5rem 1rem;
  max-width: 400px;
  position: fixed;
  top: 1rem;
  margin: auto;
  right: 1rem;
  left: 1rem;
  z-index: 1000;
  animation: fadeInDown 0.6s ease-out both;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  button {
    border: none;
    padding: 0.8em 1.2em;
    border-radius: 0.4em;
    font-family: inherit;
    font-size: 0.8rem;
    display: inline-block;
    min-width: 4rem;
    background: var(--gray3);
    text-align: center;
    color: var(--gray6);
    outline: none;
    font-weight: 500;
    transition: transform 0.1s;
  }

  a {
    color: slateblue;
    text-decoration: underline;
    font-weight: 500;
    transition: transform 0.1s;
    margin-top: 1rem;
  }
`;

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

const placeholders = Array(8)
  .fill(0)
  .map(() => <Placeholder />);

function ListContent() {
  const [showMakeItStaph, setShowMakeItStaph] = createSignal(false);
  const [showContribLink, setShowContribLink] = createSignal(false);

  function onShowMakeItStaph() {
    setShowMakeItStaph(true);
  }
  function makeItStaph() {
    localStorage.setItem('isSurprise', 'false');
    setShowContribLink(true);
    setShowMakeItStaph(false);
  }

  const loading = () =>
    resources.menus[0].loading ||
    resources.restaurants[0].loading ||
    resources.areas[0].loading;
  return (
    <Switch>
      <Match when={loading()}>{placeholders}</Match>
      <Match
        when={
          state.preferences.selectedArea === -2 &&
          !state.preferences.useLocation
        }
      >
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
      <Match when={!useFormattedRestaurants().length}>
        <Notice>
          <InlineIcon>
            <WarningIcon />
          </InlineIcon>{' '}
          {computedState.translations().emptyRestaurants}
        </Notice>
      </Match>
      <Match when={true}>
        {showMakeItStaph() && (
          <MakeItStopButton onClick={makeItStaph}>
            make it stop
          </MakeItStopButton>
        )}
        {showContribLink() && (
          <ContribModal>
            <p>
              Thanks for using Kanttiinit.fi! Visit our GitHub page to
              contribute to the project and help us keep it alive.
            </p>
            <a
              href="https://kanttiinit.github.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              kanttiinit.github.io
            </a>
            <button onClick={() => setShowContribLink(false)}>close</button>
          </ContribModal>
        )}
        <For each={useFormattedRestaurants()}>
          {restaurant => (
            <Restaurant
              restaurant={restaurant}
              onShowMakeItStaph={onShowMakeItStaph}
            />
          )}
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
