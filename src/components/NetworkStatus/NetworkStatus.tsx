import * as React from 'react';
import * as c from 'classnames';
import { MdErrorOutline } from 'react-icons/md';

import Text from '../Text';
import * as css from './NetworkStatus.scss';

export default class NetworkStatus extends React.PureComponent {
  state: {
    online: boolean;
  } = {
    online: true
  };

  updateNetworkStatus = () => {
    this.setState({ online: navigator.onLine });
  };

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
      <div className={c(css.offline, !online && css.active)}>
        <MdErrorOutline />&nbsp;<Text id="offline" />
      </div>
    );
  }
}
