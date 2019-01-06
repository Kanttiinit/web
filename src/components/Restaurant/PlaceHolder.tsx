import * as random from 'lodash/random';
import * as times from 'lodash/times';
import * as React from 'react';
import styled, { keyframes } from 'styled-components';

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
  background-color: var(--gray6);
  background-image: linear-gradient(
    90deg,
    var(--gray6),
    var(--gray6),
    var(--gray6)
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

export default class Placeholder extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <PlaceholderContainer>
        <Header width={random(30, 40)} />
        <Body>
          {times(10, (i: number) => (
            <Course key={i} width={random(40, 100)} />
          ))}
        </Body>
      </PlaceholderContainer>
    );
  }
}
