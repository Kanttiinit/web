import * as React from 'react';
import classnames from 'classnames';
import Text from '../Text';

import * as styles from './AssetsLoading.scss';

export default class AssetsLoading extends React.PureComponent {
  timeout: NodeJS.Timer;

  state = {
    showError: false
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
      <div
        className={classnames(
          styles.container,
          this.state.showError && styles.visible
        )}
      >
        <Text element="p" id="assetsLoading" />
      </div>
    );
  }
}
