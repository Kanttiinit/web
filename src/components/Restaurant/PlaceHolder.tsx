import { For } from 'solid-js';
import { keyframes, styled } from 'solid-styled-components';

import { Container, courseListStyles } from './Restaurant';

const animation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const PlaceholderContainer = styled(Container)`
  opacity: 0.5;
`;

const AnimationBase = styled.div<{ width: number }>`
  animation: ${animation} 1.2s ease-in-out infinite;
  background-color: var(--bg-interactive);
  background-image: linear-gradient(
    90deg,
    var(--bg-interactive),
    var(--bg-interactive),
    var(--bg-interactive)
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
  display: inline-block;
  line-height: 1;
  width: ${props => props.width || 100}%;
`;

const Header = styled(AnimationBase)`
  border-radius: 0.1rem;
  height: 1.5rem;
`;

const Course = styled(AnimationBase)`
  border-radius: 0.1rem;
  margin: 0.1rem 0;
  height: 0.7rem;
  transition: width 0.2s;
`;

const Body = styled.div`
  ${courseListStyles}
`;

const arr = Array(10).fill(0);

export default function PlaceHolder() {
  return (
    <PlaceholderContainer>
      <Header width={30 + Math.random() * 10} />
      <Body>
        <For each={arr}>{() => <Course width={40 + Math.random() * 60} />}</For>
      </Body>
    </PlaceholderContainer>
  );
}
