import { splitProps } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakSmall } from '../globalStyles';

interface Props {
  children?: any;
  title: any;
  compactTitle?: boolean;
  class?: string;
}

const Container = styled.div`
  background: var(--gray7);
  padding: 1.25rem 1.5rem 1.5rem;

  @media (max-width: ${breakSmall}) {
    padding: 1rem 0.75rem 1.25rem;
  }
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  color: var(--gray1);

  p,
  strong,
  ul {
    color: var(--gray1);
  }
`;

const Title = styled.h1<{ compact?: boolean }>`
  margin: 1em 0;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--gray1);
  font-size: ${props => (props.compact ? '1.4em' : '1.5em')};

  &:first-child {
    margin-top: 0;
  }

  @media (max-width: ${breakSmall}) {
    font-size: 1.2em;
  }

  &:first-child {
    margin-top: 0;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0 0.5rem 0;
    top: 0;
    z-index: 1000;
  }
`;

const PageContainer = (props: Props) => {
  const [ownProps, rest] = splitProps(props, [
    'children',
    'title',
    'class',
    'compactTitle',
  ]);
  return (
    <Container {...rest}>
      {ownProps.title && (
        <Title compact={ownProps.compactTitle}>{ownProps.title}</Title>
      )}
      {ownProps.children}
    </Container>
  );
};

export default PageContainer;
