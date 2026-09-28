import { Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import logo from '../assets/logo.png';
import { CloseIcon } from '../icons';
import { computedState, setState, state } from '../state';

// Change the id for a new announcement so earlier dismissals don't hide it.
const BANNER_ID = 'ios-app';
const APP_STORE_URL =
  'https://apps.apple.com/fi/app/kanttiinit-fi/id6814973609';

// Safari shows the native Smart App Banner (see index.html). Chrome, Firefox
// and Edge on iOS don't, so we render a look-alike for them.
const isThirdPartyIOSBrowser = /CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem 0.625rem 0.375rem;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.25;
`;

const CloseButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 2.75rem;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
`;

const Icon = styled.img`
  flex-shrink: 0;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 22.5%;
  box-shadow: 0 0 0 0.5px var(--border);
`;

const Info = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Title = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const Subtitle = styled.span`
  font-size: 0.8125rem;
  color: var(--text-secondary);
`;

const ViewButton = styled.a`
  flex-shrink: 0;
  padding: 0.375rem 1rem;
  border-radius: var(--radius-full);
  background: var(--bg-interactive);
  font-size: 0.9375rem;
  font-weight: 600;

  &:link,
  &:visited {
    color: #007aff;
    text-decoration: none;
  }
`;

export default function AppBanner() {
  const isVisible = () =>
    isThirdPartyIOSBrowser &&
    !state.preferences.dismissedBanners.includes(BANNER_ID);

  const dismiss = () =>
    setState('preferences', 'dismissedBanners', ids => [...ids, BANNER_ID]);

  return (
    <Show when={isVisible()}>
      <Container>
        <CloseButton
          type="button"
          onClick={dismiss}
          aria-label={computedState.translations().closeModal}
        >
          <CloseIcon size={16} aria-hidden="true" />
        </CloseButton>
        <Icon src={logo} alt="" />
        <Info>
          <Title>Kanttiinit</Title>
          <Subtitle>{computedState.translations().appBannerSubtitle}</Subtitle>
          <Subtitle>{computedState.translations().appBannerStore}</Subtitle>
        </Info>
        <ViewButton href={APP_STORE_URL} target="_blank" rel="noopener">
          {computedState.translations().appBannerView}
        </ViewButton>
      </Container>
    </Show>
  );
}
