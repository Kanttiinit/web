import { useLocation, useNavigate } from '@solidjs/router';
import { createEffect, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakLarge, breakSmall } from '../globalStyles';
import { computedState } from '../state';
import { ErrorBoundary } from './ErrorBoundary';
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
    props.darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  backdrop-filter: blur(3px) saturate(1.1);
  -webkit-backdrop-filter: blur(3px);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: opacity 0.15s;
  opacity: 0;

  @media (max-width: ${breakSmall}) {
    background: var(--bg-app);
  }

  ${props => (props.open ? 'opacity: 1;' : '')}
`;

const Content = styled.div<{ open: boolean }>`
  z-index: 6;
  position: relative;
  max-width: 40rem;
  min-height: 20rem;
  border-radius: var(--radius-lg);
  overflow: auto;
  background: var(--bg-app);
  border: 1px var(--border-subtle) solid;
  box-shadow: var(--shadow-md), 0 0 0 1px rgba(0,0,0,0.04);
  flex: 1;
  max-height: 90vh;
  transform-origin: center bottom;

  /* Closed — snappy dismiss */
  opacity: 0;
  transform: translateY(10px) scale(0.97);
  transition: opacity 0.1s ease-in, transform 0.12s ease-in;

  /* Open — spring entry */
  ${props =>
    props.open &&
    `
    animation:
      modalFadeIn 0.08s ease-out both,
      modalSpringIn 0.2s cubic-bezier(0.34, 1.15, 0.64, 1) both;
  `}

  @keyframes modalFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes modalSpringIn {
    from { transform: translateY(10px) scale(0.97); }
    to   { transform: translateY(0) scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transform: none !important;
    transition: opacity 0.15s ease-out;
    opacity: ${props => (props.open ? 1 : 0)};
  }

  @media (max-width: ${breakSmall}) {
    max-width: 100%;
  }
`;

const CloseText = styled.div<{ open: boolean }>`
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-weight: 400;
  font-size: 0.85rem;
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
    navigate(`/${location.search}`, { replace: true, scroll: false });

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
    </Container>
  );
};

export default Modal;
