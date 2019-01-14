import * as React from 'react';
import styled from 'styled-components';

import Text from './Text';

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

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoading(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Container showLoading={showLoading}>
      <Text element="p" id="assetsLoading" />
    </Container>
  );
};

export default AssetsLoading;
