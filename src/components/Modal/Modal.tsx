import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

import { ErrorBoundary } from '../../index';
import PageContainer from '../PageContainer';
import Text from '../Text';

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

const ModalError = () => (
  <PageContainer title={<Text id="error" />}>
    <Text id="errorDetails" element="p" />
  </PageContainer>
);

const Container = styled.div<{ state: TransitionState }>`
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

  ${props => props.state === 'entered' && 'pointer-events: auto;'}
`;

const Overlay = styled.div<{ state: TransitionState }>`
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

  ${props => props.state === 'entering' && 'opacity: 0;'}
  ${props => props.state === 'entered' && 'opacity: 1;'}
`;

const Content = styled.div<{ state: TransitionState }>`
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

  ${props => props.state === 'entering' && 'opacity: 0;'}
  ${props => props.state === 'entered' && 'opacity: 1;'}
`;

const CloseText = styled.div<{ state: TransitionState }>`
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

  ${props => props.state === 'entering' && 'opacity: 0;'}
  ${props => props.state === 'entered' && 'opacity: 1;'}
`;

type Props = RouteComponentProps<any> & {
  children: any;
  open: boolean;
};

const Modal = (props: Props) => {
  const closeModal = React.useCallback(
    () => props.history.replace('/' + props.location.search),
    [props.location]
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(
    () => {
      if (props.open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'initial';
      }
    },
    [props.open]
  );

  return (
    <Transition timeout={200} in={props.open} appear>
      {(state: TransitionState) => (
        <Container state={state}>
          <React.Fragment>
            <Overlay state={state} onClick={closeModal} />
            <Content state={state}>
              <ErrorBoundary FallbackComponent={ModalError}>
                {props.children}
              </ErrorBoundary>
            </Content>
            <CloseText state={state} onClick={closeModal}>
              <Text id="closeModal" />
            </CloseText>
          </React.Fragment>
        </Container>
      )}
    </Transition>
  );
};

export default withRouter(Modal);
