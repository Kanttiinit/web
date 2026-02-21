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
  color: var(--text-muted);
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
  background: var(--bg-surface);
  padding: 0.4em;
  box-shadow: var(--shadow-popover);
  border-radius: var(--radius-md);
  transform-origin: top right;

  /* Closed — fast snappy dismiss */
  opacity: 0;
  transform: translateY(-2px) scaleX(0.96) scaleY(0.5);
  pointer-events: none;
  transition: opacity 0.08s ease-in, transform 0.1s ease-in;

  /* Open — spring entry animation */
  ${props =>
    props.isOpen
      ? `
    pointer-events: all;
    animation:
      popoverFadeIn 0.06s ease-out both,
      popoverSpringIn 0.25s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  `
      : ''}

  @keyframes popoverFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes popoverSpringIn {
    from { transform: translateY(-2px) scaleX(0.96) scaleY(0.5); }
    to   { transform: translateY(0) scaleX(1) scaleY(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transform: none !important;
    transition: opacity 0.15s ease-out;
    opacity: ${props => (props.isOpen ? 1 : 0)};
  }

  @media (max-width: ${breakSmall}) {
    transform-origin: top center;
    top: 52px;
    left: 0.5rem;
    right: 0.5rem;
    width: auto;
    border: 1px solid var(--border-subtle);
  }
`;

const MobileOverlay = styled.div<{ open: boolean }>`
  display: none;

  @media (max-width: ${breakSmall}) {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 2.5rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease-out;

    ${props => (props.open ? 'opacity: 1; pointer-events: auto;' : '')}
  }
`;

const MobileOverlayClose = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.6rem 1.5rem;
  border-radius: var(--radius-full);
  background: var(--bg-surface);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-subtle);
`;

const PopoverHeader = styled.div`
  text-transform: uppercase;
  font-size: 0.65rem;
  color: var(--text-disabled);
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
    <>
      <MobileOverlay open={areaSelectorOpen()} onClick={closeAreaSelector}>
        <MobileOverlayClose>
          {computedState.translations().closeModal}
        </MobileOverlayClose>
      </MobileOverlay>
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
    </>
  );
}
