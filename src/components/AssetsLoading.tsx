import * as React from 'react';
import styled from 'solid-styled-components';

import { useTranslations } from '../utils/hooks';

const Container = styled.div<{ showLoading: boolean }>`
  width: 100%;
  height: 100%;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 5em;
  background: var(--gray7);

  p {
    transition: opacity 0.2s;
    opacity: ${props => (props.showLoading ? 1 : 0)};
  }
`;

const AssetsLoading = () => {
  const [showLoading, setShowLoading] = React.useState(false);
  const translations = useTranslations();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoading(true);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Container showLoading={showLoading}>
      <p>{translations.assetsLoading}</p>
    </Container>
  );
};

export default AssetsLoading;
