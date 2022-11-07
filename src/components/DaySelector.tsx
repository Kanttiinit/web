import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import { For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { isDateInRange } from '../contexts/uiContext';

import { breakLarge, breakSmall } from '../globalStyles';
import { state } from '../state';
import { createDayFormatter } from '../utils/hooks';
import Link from './Link';

interface DayLinkProps {
  day: Date;
  selectedDay: Date;
  root?: string;
}

const Container = styled.nav`
  flex: 1;
  white-space: nowrap;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledLink = styled<{ activeLink: boolean }>(({ activeLink, ...props }) => <Link {...props} />)<{
  activeLink: boolean;
}>`
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
      props.activeLink ?
      `
      color: var(--gray1);
      font-weight: 600;
    ` : ''}

    @media (min-width: ${breakSmall}) {
      font-size: 0.8rem;
    }

    @media (max-width: ${breakLarge}) {
      margin: 0;
    }
  }
`;

const DayLink = ({ day, selectedDay, root }: DayLinkProps) => {
  const formatDate = createDayFormatter();
  const search = isSameDay(day, new Date())
    ? ''
    : `?day=${format(day, 'y-MM-dd')}`;
  const active = isSameDay(selectedDay, day);

  return (
    <StyledLink activeLink={active} to={root + search}>
      {formatDate()(day, 'iiiiii d.M.')}
    </StyledLink>
  );
};

export default function DaySelector(props: { root: string }) {
  return (
    <Container>
      {!isDateInRange(state.selectedDay) && (
        <DayLink day={state.selectedDay} selectedDay={state.selectedDay} />
      )}
      <For each={state.displayedDays}>
        {day =>
          <DayLink
            root={props.root}
            selectedDay={state.selectedDay}
            day={day}
          />
        }
      </For>
    </Container>
  );
};