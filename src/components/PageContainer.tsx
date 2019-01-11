import * as React from 'react';
import styled from 'styled-components';

interface Props {
  children?: any;
  title: any;
  className?: string;
}

const Container = styled.div`
  background: var(--gray7);
  padding: 0.5rem 1rem 1rem;
  border: 1px var(--gray6) solid;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;

  p {
    color: var(--gray1);
  }
`;

const Title = styled.h1`
  margin: 1em 0;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: var(--gray1);

  &:first-child {
    margin-top: 0;
  }

  @media (max-width: ${props => props.theme.breakSmall}) {
    font-size: 1.2em;
  }

  &:first-child {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: normal;
    padding: 0.5rem 0 0.5rem 0;
    top: 0;
    z-index: 1000;
  }
`;

const PageContainer = ({ children, title, ...rest }: Props) => (
  <Container {...rest}>
    {title && <Title>{title}</Title>}
    {children}
  </Container>
);

export default PageContainer;
