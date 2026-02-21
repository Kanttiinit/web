import { A, useLocation } from '@solidjs/router';
import { format, isSameDay } from 'date-fns';
import {
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js';
import { styled } from 'solid-styled-components';

import { state } from '../state';
import { formattedDay, isDateInRange } from '../utils';

interface DayLinkProps {
  day: Date;
  selectedDay: Date;
}

const Wrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
`;

const Container = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  overflow-x: auto;
  padding: 6px 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// Wrapper so 'active' doesn't leak to the DOM <a> element
function DayA(props: {
  active: boolean;
  href: string;
  noScroll?: boolean;
  class?: string;
  children?: JSX.Element;
}) {
  const [, rest] = splitProps(props, ['active']);
  return <A {...rest} />;
}

const StyledLink = styled(DayA)<{ active: boolean }>`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 0.35rem 0.6rem;
    border-radius: var(--radius-md);
    min-width: 2.5rem;
    text-align: center;
    background: ${props => (props.active ? 'var(--radio-selected)' : 'transparent')};
    border: ${props => (props.active ? '1px solid var(--border-subtle)' : '1px solid transparent')};
    color: ${props => (props.active ? 'var(--text-primary)' : 'var(--text-disabled)')};
    transition: background 0.15s, color 0.15s, border-color 0.15s;

    &:hover {
      background: var(--radio-selected);
      color: var(--text-primary);
    }

    &:focus {
      outline: none;
    }
  }
`;

const WeekDay = styled.span`
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1;
`;

const DateNum = styled.span`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.1;
`;

const DayLink = (props: DayLinkProps) => {
  const weekday = formattedDay(props.day, 'iiiiii');
  const dateNum = formattedDay(props.day, 'd');
  const location = useLocation();
  const isActive = () => isSameDay(props.selectedDay, props.day);

  const href = createMemo(() => {
    const params = new URLSearchParams(location.search);
    if (isSameDay(props.day, new Date())) {
      params.delete('day');
    } else {
      params.set('day', format(props.day, 'y-MM-dd'));
    }
    const qs = params.toString();
    return location.pathname + (qs ? `?${qs}` : '');
  });

  return (
    <StyledLink active={isActive()} href={href()} noScroll>
      <WeekDay>{weekday()}</WeekDay>
      <DateNum>{dateNum()}</DateNum>
    </StyledLink>
  );
};

function getMask(left: boolean, right: boolean) {
  const fade = '2.5rem';
  if (left && right) {
    return `linear-gradient(to right, transparent, black ${fade}, black calc(100% - ${fade}), transparent)`;
  }
  if (left) {
    return `linear-gradient(to right, transparent, black ${fade})`;
  }
  if (right) {
    return `linear-gradient(to right, black calc(100% - ${fade}), transparent)`;
  }
  return 'none';
}

export default function DaySelector() {
  let containerRef: HTMLElement | undefined;
  const [showLeft, setShowLeft] = createSignal(false);
  const [showRight, setShowRight] = createSignal(false);

  const updateFades = () => {
    if (!containerRef) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef;
    setShowLeft(scrollLeft > 1);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  onMount(() => {
    if (!containerRef) return;
    containerRef.addEventListener('scroll', updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(containerRef);
    updateFades();
    onCleanup(() => {
      containerRef?.removeEventListener('scroll', updateFades);
      ro.disconnect();
    });
  });

  const mask = () => getMask(showLeft(), showRight());

  return (
    <Wrapper>
      <Container
        ref={containerRef}
        style={{
          '-webkit-mask-image': mask(),
          'mask-image': mask(),
        }}
      >
        {!isDateInRange(state.selectedDay) && (
          <DayLink day={state.selectedDay} selectedDay={state.selectedDay} />
        )}
        <For each={state.displayedDays}>
          {day => <DayLink selectedDay={state.selectedDay} day={day} />}
        </For>
      </Container>
    </Wrapper>
  );
}
