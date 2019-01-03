import * as React from 'react';
import styled from 'styled-components';

type Props = {
  children?: any;
  title: any;
  className?: string;
};

const Container = styled.div`
  background: var(--gray7);
  padding: 0.5rem 1rem 1rem;
  border: 1px var(--gray6) solid;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;

  h1:first-child {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: normal;
    padding: 0.5rem 0 0.5rem 0;
    top: 0;
    z-index: 1000;
  }

  p {
    color: var(--gray1);
  }
`;

const PageContainer = ({ children, title, ...rest }: Props) => (
  <Container {...rest}>
    {title && <h1>{title}</h1>}
    {children}
  </Container>
);

export default PageContainer;
