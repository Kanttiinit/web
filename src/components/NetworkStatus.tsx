import * as React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import styled from 'styled-components';

import { useTranslations } from '../utils/hooks';

const Container = styled.div<{ online: boolean }>`
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
    !props.online &&
    `
    padding: 0.5em 1em;
    margin: 0.5em;
    height: 1.5em;
    opacity: 1;
  `}
`;

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(true);
  const translations = useTranslations();

  React.useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return (
    <Container online={isOnline}>
      <MdErrorOutline />
      &nbsp;
      {translations.offline}
    </Container>
  );
};

export default NetworkStatus;
