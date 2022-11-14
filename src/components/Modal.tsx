import { createEffect, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useLocation, useNavigate } from '@solidjs/router';
import { ErrorBoundary } from '..';
import { breakLarge, breakSmall } from '../globalStyles';
import { computedState } from '../state';

import PageContainer from './PageContainer';

const ModalError = () => {
  return (
    <PageContainer title={computedState.translations().error}>
      {computedState.translations().errorDetails}
    </PageContainer>
  );
};

const Container = styled.div<{ open: boolean }>`
  @media (min-width: ${breakLarge}) {
    padding: 0.5rem;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: ${breakSmall}) {
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

  ${props => (props.open ? 'pointer-events: auto;' : '')}
`;

const Overlay = styled.div<{ open: boolean; darkMode: boolean }>`
  background: ${props =>
    props.darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(0, 0, 0, 0.55)'};
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: opacity 0.15s;
  opacity: 0;

  @media (max-width: ${breakSmall}) {
    background: var(--gray6);
  }

  ${props => (props.open ? 'opacity: 1;' : '')}
`;

const Content = styled.div<{ open: boolean }>`
  z-index: 6;
  position: relative;
  max-width: 40rem;
  border-radius: 0.8rem;
  overflow: auto;
  border: 1px var(--gray6) solid;
  box-shadow: 0rem 0.1rem 0.6rem -0.2rem rgba(0, 0, 0, 0.3);
  flex: 1;
  transition: opacity 0.3s;
  opacity: 0;
  max-height: 90vh;

  @media (max-width: ${breakSmall}) {
    max-width: 100%;
  }

  ${props => (props.open ? 'opacity: 1;' : '')}
`;

const CloseText = styled.div<{ open: boolean }>`
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

  @media (min-width: ${breakLarge}) {
    display: none;
  }

  ${props => (props.open ? 'opacity: 1;' : '')}
`;

type Props = {
  children: any;
};

const Modal = (props: Props) => {
  const [open, setOpen] = createSignal(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeModal = () =>
    navigate('/' + location.search, { replace: true, scroll: false });

  createEffect(() => {
    setOpen(location.pathname !== '/');
  });

  createEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [location.pathname]);

  createEffect(() => {
    if (open()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }
  });

  return (
    <Container open={open()}>
      <>
        <Overlay
          darkMode={computedState.darkMode()}
          open={open()}
          onClick={closeModal}
        />
        <Content open={open()}>
          <ErrorBoundary fallback={ModalError}>{props.children}</ErrorBoundary>
        </Content>
        <CloseText open={open()} onClick={closeModal}>
          {computedState.translations().closeModal}
        </CloseText>
      </>
    </Container>
  );
};

export default Modal;
