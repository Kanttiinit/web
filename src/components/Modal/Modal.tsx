import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { ErrorBoundary } from '../../index';
import PageContainer from '../PageContainer';
import Text from '../Text';
import * as css from './Modal.scss';
import styled from 'styled-components';

const ModalError = () => (
  <PageContainer title={<Text id="error" />}>
    <Text id="errorDetails" element="p" />
  </PageContainer>
);

const Container = styled(CSSTransition)`
  @media (min-width: ${props => props.theme.breakLarge}) {
    padding: 0.5rem;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: ${props => props.theme.breakSmall}) {
    flex-direction: column;
  }

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 11;
  pointer-events: none;
  display: flex;
`;

const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.55);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: opacity 0.15s;
  opacity: 0;

  @media (max-width: ${props => props.theme.breakSmall}) {
    background: var(--gray6);
  }
`;

const Content = styled.div`
  z-index: 6;
  position: relative;
  max-width: 40rem;
  border-radius: 0.2rem;
  overflow: auto;
  box-shadow: 0rem 0.1rem 0.6rem -0.2rem rgba(0, 0, 0, 0.3);
  flex: 1;
  transition: opacity 0.3s;
  opacity: 0;
  max-height: 90vh;

  @media (max-width: ${props => props.theme.breakSmall}) {
    max-width: 100%;
  }
`;

const CloseText = styled.div`
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: var(--gray4);
  font-weight: 300;
  font-size: 0.9em;
  height: 5rem;
  transition: opacity 0.2s;
  opacity: 0;

  @media (min-width: ${props => props.theme.breakLarge}) {
    display: none;
  }
`;

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
      <Container
        classNames={classNames}
        timeout={200}
        in={this.props.open}
        unmountOnExit
        appear
      >
        <div>
          <Overlay onClick={this.closeModal} />
          <Content>
            <ErrorBoundary FallbackComponent={ModalError}>
              {this.props.children}
            </ErrorBoundary>
          </Content>
          <CloseText onClick={this.closeModal}>
            <Text id="closeModal" />
          </CloseText>
        </div>
      </Container>
    );
  }
}

export default withRouter(Modal);
