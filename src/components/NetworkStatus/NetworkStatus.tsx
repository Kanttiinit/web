import * as React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import styled from 'styled-components';

import Text from '../Text';

const Container = styled.div<{ online: boolean }>`
  background: rgb(255, 222, 148);
  border-radius: 0.5em;
  box-shadow: 0px 1px 4px -2px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  height: 0;
  opacity: 0;
  transition: padding 0.2s, margin 0.2s, height 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props =>
    !props.online &&
    `
    padding: 0.5em 1em;
    margin: 0.5em;
    height: 1.5em;
    opacity: 1;
  `}
`;

export default class NetworkStatus extends React.PureComponent {
  state: {
    online: boolean;
  } = {
    online: true
  };

  updateNetworkStatus = () => {
    this.setState({ online: navigator.onLine });
  }

  componentDidMount() {
    window.addEventListener('online', this.updateNetworkStatus);
    window.addEventListener('offline', this.updateNetworkStatus);
    this.updateNetworkStatus();
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateNetworkStatus);
    window.removeEventListener('offline', this.updateNetworkStatus);
  }

  render() {
    const { online } = this.state;

    return (
      <Container online={online}>
        <MdErrorOutline />
        &nbsp;
        <Text id="offline" />
      </Container>
    );
  }
}
