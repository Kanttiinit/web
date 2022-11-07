import * as React from 'react';
import styled from 'solid-styled-components';

interface Props {
  children?: any;
  title: any;
  compactTitle?: boolean;
  className?: string;
}

const Container = styled.div`
  background: var(--gray7);
  padding: 0.5rem 1rem 1rem;
  border: 1px var(--gray6) solid;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  color: var(--gray1);

  p, strong, ul {
    color: var(--gray1);
  }
`;

const Title = styled.h1<{ compact?: boolean }>`
  margin: 1em 0;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: var(--gray1);
  font-size: ${props => (props.compact ? '1.5em' : '1.75em')};

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

const PageContainer = ({ children, title, compactTitle, ...rest }: Props) => (
  <Container {...rest}>
    {title && <Title compact={compactTitle}>{title}</Title>}
    {children}
  </Container>
);

export default PageContainer;
