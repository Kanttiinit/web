import { createEffect, createMemo, createSignal, onCleanup, Show } from 'solid-js';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { styled } from 'solid-styled-components';

import { computedState } from '../state';
import translations from '../translations';

const Container = styled.div`
  font-size: 0.8rem;
  position: fixed;
  background: var(--gray2);
  color: var(--gray7);
  padding: 0.25rem 0.5rem;
  margin: 1em;
  z-index: 99999;
  white-space: nowrap;
  pointer-events: none;
  border-radius: 0.25rem;
`;

type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

type PrimaryPlacement = 'top' | 'bottom' | 'left' | 'right';
type Alignment = 'start' | 'end' | undefined;

const parsePlacement = (value: Placement): [PrimaryPlacement, Alignment] => {
  const [primary, align] = value.split('-') as [PrimaryPlacement | undefined, Alignment];
  return [(primary ?? 'bottom') as PrimaryPlacement, align];
};

interface Props {
  children: JSX.Element;
  text?: string;
  translationKey?: keyof typeof translations;
  position?: Placement;
  class?: string;
  style?: JSX.CSSProperties;
}

const GAP = 8;

const Tooltip = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [coordinates, setCoordinates] = createSignal<{ top: number; left: number }>({
    top: 0,
    left: 0
  });
  let anchorRef: HTMLSpanElement | undefined;
  let tooltipRef: HTMLDivElement | undefined;

  const placement = () => props.position ?? 'bottom-start';

  const updatePosition = () => {
    if (!anchorRef || !tooltipRef) {
      return;
    }

    const anchorRect = anchorRef.getBoundingClientRect();
    const tooltipRect = tooltipRef.getBoundingClientRect();
    const [primary, alignment] = parsePlacement(placement());

    let top = anchorRect.bottom + GAP;
    let left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;

    switch (primary) {
      case 'top':
        top = anchorRect.top - tooltipRect.height - GAP;
        break;
      case 'bottom':
        top = anchorRect.bottom + GAP;
        break;
      case 'left':
        top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
        left = anchorRect.left - tooltipRect.width - GAP;
        break;
      case 'right':
        top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
        left = anchorRect.right + GAP;
        break;
    }

    if (primary === 'top' || primary === 'bottom') {
      if (alignment === 'start') {
        left = anchorRect.left;
      } else if (alignment === 'end') {
        left = anchorRect.right - tooltipRect.width;
      }
    } else if (alignment === 'start') {
      top = anchorRect.top;
    } else if (alignment === 'end') {
      top = anchorRect.bottom - tooltipRect.height;
    }

    const margin = 8;
    const maxLeft = window.innerWidth - tooltipRect.width - margin;
    const maxTop = window.innerHeight - tooltipRect.height - margin;

    left = Math.max(margin, Math.min(left, maxLeft));
    top = Math.max(margin, Math.min(top, maxTop));

    setCoordinates({
      top: top + window.scrollY,
      left: left + window.scrollX
    });
  };

  const setTooltip = (element: HTMLDivElement) => {
    tooltipRef = element;
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => updatePosition());
    }
  };

  createEffect(() => {
    if (!isOpen()) {
      return;
    }

    placement();
    updatePosition();

    const reposition = () => updatePosition();

    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);

    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(reposition);
      if (anchorRef) {
        resizeObserver.observe(anchorRef);
      }
      if (tooltipRef) {
        resizeObserver.observe(tooltipRef);
      }
    }

    onCleanup(() => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      resizeObserver?.disconnect();
    });
  });

  const hasTooltip = createMemo(() => {
    if (props.text) {
      return true;
    }

    if (!props.translationKey) {
      return false;
    }

    return props.translationKey in translations;
  });

  const contents = createMemo(() => {
    if (props.text) {
      return props.text;
    }

    if (!props.translationKey) {
      return '';
    }

    return computedState.translations()[props.translationKey];
  });

  return (
    <Show
      when={hasTooltip()}
      fallback={props.children}
    >
      <span
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        ref={anchorRef}
        class={props.class}
        style={props.style}
      >
        {props.children}
      </span>
      {isOpen() && (
        <Portal mount={document.body}>
          <Container
            ref={setTooltip}
            style={{
              top: `${coordinates().top}px`,
              left: `${coordinates().left}px`
            }}
          >
            {contents()}
          </Container>
        </Portal>
      )}
    </Show>
  );
};

export default Tooltip;
