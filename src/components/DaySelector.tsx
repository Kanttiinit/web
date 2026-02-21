import { A, useLocation } from '@solidjs/router';
import { format, isSameDay } from 'date-fns';
import { createMemo, For, type JSX, splitProps } from 'solid-js';
import { styled } from 'solid-styled-components';

import { state } from '../state';
import { formattedDay, isDateInRange } from '../utils';

interface DayLinkProps {
  day: Date;
  selectedDay: Date;
}

const Container = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  overflow-x: auto;
  padding: 6px 0;

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
    color: ${props => (props.active ? 'var(--text-primary)' : 'var(--text-disabled)')};
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: var(--radio-selected);
      color: var(--text-primary);
    }

    &:focus {
      outline: 2px solid var(--accent_color);
      outline-offset: 2px;
    }
  }
`;

const WeekDay = styled.span`
  font-size: 0.6rem;
  font-weight: 600;
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

export default function DaySelector() {
  return (
    <Container>
      {!isDateInRange(state.selectedDay) && (
        <DayLink day={state.selectedDay} selectedDay={state.selectedDay} />
      )}
      <For each={state.displayedDays}>
        {day => <DayLink selectedDay={state.selectedDay} day={day} />}
      </For>
    </Container>
  );
}
