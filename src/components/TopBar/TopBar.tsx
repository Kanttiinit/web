import FI from './fi.svg';
import EN from './en.svg';;

import { styled, css } from 'solid-styled-components';
import { langContext } from '../../contexts';
// import { useTranslations, useUnseenUpdates } from '../../utils/hooks';
// import AreaSelector from '../AreaSelector';
import ClickOutside from '../ClickOutside';
import DaySelector from '../DaySelector';
// import InlineIcon from '../InlineIcon';
import Link from '../Link';
import { actions, state } from '../../state';
import { breakSmall } from '../../globalStyles';
import { createSignal, onCleanup, onMount } from 'solid-js';

const Container = styled.header`
  background: linear-gradient(to bottom, var(--gray7) 0%, var(--gray6) 100%);
  box-sizing: border-box;
  padding: 0 0.5em;
  position: fixed;
  width: 100%;
  z-index: 10;
  color: var(--gray3);
  border-bottom: 1px solid var(--gray5);
  user-select: none;

  @media (max-width: ${breakSmall}) {
    background-color: var(--gray6);
    justify-content: flex-start;
    padding: 0.2em;
    padding-left: 1rem;
  }

  ${state.darkMode ?
    'background: linear-gradient(to bottom,var(--gray6),var(--gray7) 100%)' : ''}
`;

const Content = styled.div`
  max-width: 94.2rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

// const NewsIcon = styled(MdFiberNew)`
//   color: var(--accent_color);
// `;

const AreaSelectorButton = styled(ClickOutside)`
  position: relative;

  @media (max-width: ${breakSmall}) {
    position: initial;
  }
`;

const AreaSelectorContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: 32px;
  width: 20em;
  background: var(--gray7);
  padding: 1em;
  box-shadow: 0px 7px 18px -1px rgba(50, 50, 50, 0.1);
  border-radius: 4px;
  border: solid 1px var(--gray5);
  opacity: 0;
  transition: opacity 75ms;
  pointer-events: none;

  ${props =>
    props.isOpen ?
    css`
      opacity: 1;
      pointer-events: all;
    ` : ''}

  @media (max-width: ${breakSmall}) {
    top: 52px;
    left: 0;
    width: 100%;
    box-sizing: border-box;
  }
`;

const iconLinkStyles = css`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  margin: 0 1em;

  :last-child {
    margin-right: 0;
  }

  :link,
  :visited {
    color: var(--gray3);
  }

  :hover,
  :focus {
    outline: none;
    color: var(--accent_color);
  }

  svg {
    display: none;
  }

  @media (max-width: ${breakSmall}) {
    svg {
      display: block;
    }
    span {
      display: none;
    }
  }
`;

const IconLink = styled(Link)`
  ${iconLinkStyles}
`;
const NativeIconLink = styled.a`
  ${iconLinkStyles}
`;

const FlagImg = styled.img`
  cursor: pointer;
  height: 16px;
  width: auto;
  border-radius: 2px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.33);
`;

export default function TopBar() {
  let areaSelectorLink: HTMLAnchorElement | null = null;
  const [areaSelectorOpen, setAreaSelectorOpen] = createSignal(false);

  const toggleAreaSelector = () => setAreaSelectorOpen(!areaSelectorOpen);

  const closeAreaSelector = () =>
    areaSelectorOpen() && setAreaSelectorOpen(false);

  const touchStart = (e: TouchEvent) => {
    e.preventDefault();
    toggleAreaSelector();
  };

  const touchMove = (event: TouchEvent) => {
    event.preventDefault();
    const target = document.elementFromPoint(
      event.touches[0].pageX,
      event.touches[0].pageY
    );
    if (target instanceof HTMLButtonElement) {
      target.focus();
    }
  };

  const touchEnd = (event: TouchEvent) => {
    const endTarget = document.elementFromPoint(
      event.changedTouches[0].pageX,
      event.changedTouches[0].pageY
    );
    if (endTarget instanceof HTMLElement) {
      endTarget.dispatchEvent(
        new MouseEvent('mouseup', {
          bubbles: true
        })
      );
    }
  };

  onMount(() => {
    if (areaSelectorLink) {
      areaSelectorLink.addEventListener('touchstart', touchStart, { passive: false });
      areaSelectorLink.addEventListener('touchmove', touchMove, { passive: false });
      areaSelectorLink.addEventListener('touchend', touchEnd);
    }
  });

  onCleanup(() => {
    if (areaSelectorLink) {
      areaSelectorLink.removeEventListener('touchstart', touchStart);
      areaSelectorLink.removeEventListener('touchmove', touchMove);
      areaSelectorLink.removeEventListener('touchend', touchEnd);
    }
  });

  return (
    <Container>
      <Content>
        <DaySelector root="/" />
        {state.unseenUpdates.length > 0 && (
          <Link to="/news">
            {/* <InlineIcon>
              <NewsIcon size={24} />
            </InlineIcon> */}
          </Link>
        )}
        {/* <AreaSelectorButton onClickOutside={closeAreaSelector}>
          <NativeIconLink
            ref={areaSelectorLink}
            onMouseDown={toggleAreaSelector}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && toggleAreaSelector()}
          >
            <MdMap size={18} />
            <span>{translations.selectArea}</span>
          </NativeIconLink>
          <AreaSelectorContainer isOpen={areaSelectorOpen}>
            <AreaSelector onAreaSelected={toggleAreaSelector} />
          </AreaSelectorContainer>
        </AreaSelectorButton> */}
        <IconLink to="/settings" aria-label="Settings">
          {/* <MdSettings size={18} /> */}
          <span>{state.translations.settings}</span>
        </IconLink>
        <NativeIconLink
          tabIndex={0}
          onClick={actions.toggleLang}
          onKeyDown={e => e.key === 'Enter' && actions.toggleLang()}
        >
          <FlagImg alt={state.preferences.lang.toUpperCase()} src={state.preferences.lang === 'fi' ? FI : EN} />
        </NativeIconLink>
      </Content>
    </Container>
  );
};
