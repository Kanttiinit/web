import Popper from 'popper.js';
import { createEffect, createMemo, createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { styled } from 'solid-styled-components';

import { computedState, state } from '../state';
import translations from '../translations';

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
  translationKey?: keyof typeof translations;
  position?: Popper.Position;
  class?: string;
  style?: any;
}

const Tooltip = (props: Props): any => {
  const [isOpen, setIsOpen] = createSignal(false);
  let anchorRef: HTMLSpanElement | undefined;
  let popper: Popper;

  const setTooltip = (tooltipRef: HTMLDivElement) => {
    if (anchorRef && tooltipRef && isOpen()) {
      popper = new Popper(anchorRef, tooltipRef, {
        placement: props.position || 'bottom-start'
      });
    }
  };

  if (!props.text && !(props.translationKey! in translations)) {
    return props.children;
  }

  const contents = () =>
    props.text || computedState.translations()[props.translationKey!];

  return (
    <Show
      when={props.text || props.translationKey! in translations}
      fallback={props.children}
    >
      <span
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        ref={anchorRef}
        class={props.class}
        style={props.style}
      >
        {props.children}
      </span>
      {isOpen() && (
        <Portal mount={document.body}>
          <Container ref={setTooltip}>{contents()}</Container>
        </Portal>
      )}
    </Show>
  );
};

export default Tooltip;
