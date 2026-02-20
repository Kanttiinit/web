import { format, isSameDay } from 'date-fns';
import { For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { isDateInRange } from '../utils';

import { breakLarge, breakSmall } from '../globalStyles';
import { state } from '../state';
import { formattedDay } from '../utils';
import Link from './Link';
import { useLocation } from '@solidjs/router';

interface DayLinkProps {
  day: Date;
  selectedDay: Date;
}

const Container = styled.nav`
  flex: 1;
  white-space: nowrap;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledLink = styled(Link)<{ activeLink: boolean }>`
  && {
    border: none;
    background: transparent;
    display: inline-block;
    text-transform: uppercase;
    font-size: 0.75rem;
    border-radius: 0.25em;
    color: var(--gray3);
    padding: 1.25em 2em 1.25em 0;
    transition: color 0.2s;
    font-weight: 500;

    &:first-child {
      margin-left: 0;
    }

    &:focus {
      outline: none;
      color: var(--accent_color);
    }

    &:hover {
      color: var(--gray1);
    }

    ${props =>
      props.activeLink
        ? `
      color: var(--gray1);
      font-weight: 600;
    `
        : ''}

    @media (min-width: ${breakSmall}) {
      font-size: 0.8rem;
    }

    @media (max-width: ${breakLarge}) {
      margin: 0;
    }
  }
`;

const DayLink = (props: DayLinkProps) => {
  const date = formattedDay(props.day, 'iiiiii d.M.');
  const search = () =>
    isSameDay(props.day, new Date())
      ? ''
      : `?day=${format(props.day, 'y-MM-dd')}`;
  const active = () => isSameDay(props.selectedDay, props.day);

  const location = useLocation();

  return (
    <StyledLink activeLink={active()} to={location.pathname + search()}>
      {date()}
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
