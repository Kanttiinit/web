import { createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakSmall } from '../../globalStyles';
import { CaretDownIcon, MapIcon, NewsIcon, SettingsIcon } from '../../icons';
import { computedState, resources, setState, state } from '../../state';
import { Lang } from '../../types';
import AreaSelector from '../AreaSelector';
import ClickOutside from '../ClickOutside';
import DaySelector from '../DaySelector';
import InlineIcon from '../InlineIcon';
import Link from '../Link';
import EN from './en.svg';
import FI from './fi.svg';

const Container = styled.header`
  background: var(--topbar-bg);
  backdrop-filter: blur(16px) saturate(1.8);
  -webkit-backdrop-filter: blur(16px) saturate(1.8);
  border-bottom: 1px solid var(--topbar-border);
  box-sizing: border-box;
  padding: 0 0.5em;
  position: fixed;
  width: 100%;
  z-index: 10;
  color: var(--gray3);
  user-select: none;

  @media (max-width: ${breakSmall}) {
    justify-content: flex-start;
    padding: 0.2em;
    padding-left: 1rem;
  }
`;

const Content = styled.div`
  max-width: 94.2rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

const StyledNewsIcon = styled(NewsIcon)`
  color: var(--accent_color);
`;

const AreaSelectorButton = styled(ClickOutside)`
  position: relative;
  cursor: pointer;

  @media (max-width: ${breakSmall}) {
    position: initial;
  }
`;

const AreaSelectorContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: 36px;
  width: 22em;
  background: var(--gray7);
  padding: 0.4em;
  box-shadow: var(--shadow-popover);
  border-radius: var(--radius-md);
  opacity: 0;
  transform: translateY(-6px);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
  pointer-events: none;

  ${props =>
    props.isOpen
      ? `opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    `
      : ''}

  @media (max-width: ${breakSmall}) {
    top: 52px;
    left: 0;
    width: 100%;
    box-sizing: border-box;
  }
`;

const PopoverHeader = styled.div`
  text-transform: uppercase;
  font-size: 0.65rem;
  color: var(--gray4);
  padding: 0.5rem 0.75rem 0.25rem;
  letter-spacing: 0.06em;
`;

const iconLinkStyles = `
  font-weight: 500;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0 1em;

  :last-child {
    margin-right: 0;
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

const AreaTriggerLabel = styled.span`
  @media (max-width: ${breakSmall}) {
    display: none;
  }
`;

const CaretIcon = styled(CaretDownIcon)<{ open: boolean }>`
  display: block !important;
  font-size: 0.7rem;
  transition: transform 0.15s ease-out;
  ${props => (props.open ? 'transform: rotate(180deg);' : '')}
`;

const FlagImg = styled.img`
  cursor: pointer;
  height: 16px;
  width: auto;
  border-radius: 2px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.33);
`;

export default function TopBar() {
  let areaSelectorLink: HTMLAnchorElement | undefined;
  const [areaSelectorOpen, setAreaSelectorOpen] = createSignal(false);

  const toggleAreaSelector = () => setAreaSelectorOpen(!areaSelectorOpen());

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
      event.touches[0].pageY,
    );
    if (target instanceof HTMLButtonElement) {
      target.focus();
    }
  };

  const touchEnd = (event: TouchEvent) => {
    const endTarget = document.elementFromPoint(
      event.changedTouches[0].pageX,
      event.changedTouches[0].pageY,
    );
    if (endTarget instanceof HTMLElement) {
      endTarget.dispatchEvent(
        new MouseEvent('mouseup', {
          bubbles: true,
        }),
      );
    }
  };

  onMount(() => {
    if (areaSelectorLink) {
      areaSelectorLink.addEventListener('touchstart', touchStart, {
        passive: false,
      });
      areaSelectorLink.addEventListener('touchmove', touchMove, {
        passive: false,
      });
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

  function toggleLang() {
    setState(
      'preferences',
      'lang',
      state.preferences.lang === Lang.FI ? Lang.EN : Lang.FI,
    );
  }

  const [areas] = resources.areas;

  const currentAreaLabel = createMemo(() => {
    const t = computedState.translations();
    const selected = state.preferences.selectedArea;
    if (selected === -2) return t.nearby;
    if (selected === -1) return t.starred;
    const area = areas()?.find(a => a.id === selected);
    return area?.name ?? t.selectArea;
  });

  return (
    <Container>
      <Content>
        <DaySelector />
        {computedState.unseenUpdates().length > 0 && (
          <Link to="/news">
            <InlineIcon>
              <StyledNewsIcon size={24} />
            </InlineIcon>
          </Link>
        )}
        <AreaSelectorButton onClickOutside={closeAreaSelector}>
          <NativeIconLink
            ref={areaSelectorLink}
            onMouseDown={toggleAreaSelector}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && toggleAreaSelector()}
          >
            <MapIcon size={18} style={{ 'padding-left': '1rem' }} />
            <AreaTriggerLabel>{currentAreaLabel()}</AreaTriggerLabel>
            <CaretIcon size={12} open={areaSelectorOpen()} />
          </NativeIconLink>
          <AreaSelectorContainer isOpen={areaSelectorOpen()}>
            <PopoverHeader>
              {computedState.translations().selectArea}
            </PopoverHeader>
            <AreaSelector onAreaSelected={toggleAreaSelector} />
          </AreaSelectorContainer>
        </AreaSelectorButton>
        <IconLink to="/settings" aria-label="Settings">
          <SettingsIcon size={18} />
          <span>{computedState.translations().settings}</span>
        </IconLink>
        <NativeIconLink
          tabIndex={0}
          onClick={toggleLang}
          onKeyDown={e => e.key === 'Enter' && toggleLang()}
        >
          <FlagImg
            alt={state.preferences.lang.toUpperCase()}
            src={state.preferences.lang === 'fi' ? FI : EN}
          />
        </NativeIconLink>
      </Content>
    </Container>
  );
}
