import * as React from 'react';
import Text from '../Text';

import * as styles from './AssetsLoading.scss';

export default class AssetsLoading extends React.PureComponent {
  timeout;

  state = {
    showError: false
  };

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ showError: true });
    }, 400);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    if (this.state.showError) {
      return (
        <Text element="div" className={styles.container} id="assetsLoading" />
      );
    }
    return null;
  }
}
