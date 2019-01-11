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

export default class AssetsLoading extends React.PureComponent {
  timeout: NodeJS.Timer;

  state = {
    showLoading: false
  };

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ showError: true });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <Container showLoading={this.state.showLoading}>
        <Text element="p" id="assetsLoading" />
      </Container>
    );
  }
}
