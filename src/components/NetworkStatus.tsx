import { createSignal, onCleanup, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { computedState } from '../state';
import { ErrorIcon } from '../icons';

const Container = styled.div<{ isOnline: boolean }>`
  background: rgb(255, 222, 148);
  border-radius: 0.5em;
  box-shadow: 0px 1px 4px -2px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  height: 0;
  opacity: 0;
  transition: padding 0.2s, margin 0.2s, height 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props =>
    !props.isOnline ?
    `
    padding: 0.5em 1em;
    margin: 0.5em;
    height: 1.5em;
    opacity: 1;
  ` : ''}
`;

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = createSignal(true);
  
  function updateNetworkStatus() {
    setIsOnline(navigator.onLine);
  }
  
  onMount(() => {
    // window.addEventListener('online', updateNetworkStatus);
    // window.addEventListener('offline', updateNetworkStatus);
  });
  
  onCleanup(() => {
    window.removeEventListener('online', updateNetworkStatus);
    window.removeEventListener('offline', updateNetworkStatus);
  });
  
  return (
    <Container isOnline={isOnline()}>
      <ErrorIcon />
      &nbsp;
      {computedState.translations().offline}
    </Container>
  );
}
