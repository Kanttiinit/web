import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { ErrorBoundary } from '../../index';
import PageContainer from '../PageContainer';
import Text from '../Text';
import * as css from './Modal.scss';

const ModalError = () => (
  <PageContainer title={<Text id="error" />}>
    <Text id="errorDetails" element="p" />
  </PageContainer>
);

const classNames = {
  enter: css.enter,
  enterActive: css.enterActive,
  enterDone: css.enterDone
};

type Props = RouteComponentProps<any> & {
  children: any;
  open: boolean;
};

@observer
class Modal extends React.Component<Props, {}> {
  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    this.updateBodyScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.open !== this.props.open) {
      this.updateBodyScroll();
    }
  }

  updateBodyScroll() {
    if (this.props.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeModal();
    }
  };

  closeModal = () => this.props.history.replace('/' + location.search);

  render() {
    return (
      <CSSTransition
        className={css.container}
        classNames={classNames}
        timeout={200}
        in={this.props.open}
        unmountOnExit
        appear
      >
        <div>
          <div className={css.overlay} onClick={this.closeModal} />
          <div className={css.content}>
            <ErrorBoundary FallbackComponent={ModalError}>
              {this.props.children}
            </ErrorBoundary>
          </div>
          <div className={css.closeText} onClick={this.closeModal}>
            <Text id="closeModal" />
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default withRouter(Modal);
