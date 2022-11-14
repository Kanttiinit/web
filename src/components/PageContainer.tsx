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
  padding: 0.5rem 1rem 1rem;
  border: 1px var(--gray6) solid;
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
  font-weight: 300;
  letter-spacing: 0.02em;
  color: var(--gray1);
  font-size: ${props => (props.compact ? '1.5em' : '1.75em')};

  &:first-child {
    margin-top: 0;
  }

  @media (max-width: ${breakSmall}) {
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

const PageContainer = (props: Props) => {
  const [ownProps, rest] = splitProps(props, [
    'children',
    'title',
    'class',
    'compactTitle'
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
