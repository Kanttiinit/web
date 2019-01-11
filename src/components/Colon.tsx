import * as React from 'react';

import styled from 'styled-components';

const Container = styled.span`
  span::after {
    content: ":";
    vertical-align: 1px;
    margin-right: 1px;
  }

  span:last-child::after {
    display: none;
  }
`;

const Colon = ({ children }: { children: string }) => {
  const parts = children.split(':');
  return (
    <Container>
      {parts.map((part, i) => (
        <span key={i}>{part}</span>
      ))}
    </Container>
  );
};

export default Colon;
