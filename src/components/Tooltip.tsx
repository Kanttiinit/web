import Popper from 'popper.js';
import { createEffect, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { styled } from 'solid-styled-components';

import { state } from '../state';
import translations from '../utils/translations';

const Container = styled.div`
  font-size: 0.8rem;
  position: absolute;
  background: var(--gray2);
  color: var(--gray7);
  padding: 0.25rem 0.5rem;
  margin: 1em;
  z-index: 99999;
  white-space: nowrap;
  pointer-events: none;
  border-radius: 0.25rem;
`;

interface Props {
  children: any;
  text?: string;
  translationKey?: keyof (typeof translations);
  position?: Popper.Position;
  className?: string;
}

const Tooltip = (props: Props): any => {
  const [isOpen, setIsOpen] = createSignal(false);
  let anchorRef: HTMLSpanElement | undefined;
  let tooltipRef: HTMLDivElement | undefined;
  let popper: Popper;

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  createEffect(() => {
    if (anchorRef && tooltipRef && isOpen()) {
      popper = new Popper(anchorRef, tooltipRef, {
        placement: props.position || 'bottom-start'
      });
    }
  });

  if (!props.text && !(props.translationKey in translations)) {
    return props.children;
  }

  const contents = () => props.text || state.translations[props.translationKey][state.preferences.lang];

  return (
    <>
      <span
        onMouseOver={open}
        onMouseLeave={close}
        ref={anchorRef}
        class={props.className}
      >
        {props.children}
      </span>
      {isOpen() &&
      <Portal mount={document.body}>
        <Container ref={tooltipRef}>{contents}</Container>,
      </Portal>
      }
    </>
  );
};

export default Tooltip;
