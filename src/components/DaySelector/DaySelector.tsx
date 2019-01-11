import * as format from 'date-fns/format';
import * as isSameDay from 'date-fns/is_same_day';
import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { uiContext } from '../../contexts';
import Text from '../Text';

interface DayLinkProps {
  day: Date;
  selectedDay: Date;
  root?: string;
}

const Container = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledLink = styled(({ activeLink, ...props }) => <Link {...props} />)<{
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

    &:first-child {
      margin-left: 0;
    }

    &:focus {
      outline: none;
      color: var(--gray1);
    }

    &:hover {
      color: var(--gray1);
    }

    ${props =>
      props.activeLink &&
      `
      color: var(--gray1);
      font-weight: 600;
    `}

    @media (min-width: ${props => props.theme.breakSmall}) {
      font-size: 0.8rem;
    }

    @media (max-width: ${props => props.theme.breakLarge}) {
      margin: 0;
    }
  }
`;

const DayLink = ({ day, selectedDay, root }: DayLinkProps) => {
  const search = isSameDay(day, new Date())
    ? ''
    : `?day=${format(day, 'YYYY-MM-DD')}`;
  const active = isSameDay(selectedDay, day);

  return (
    <StyledLink activeLink={active} to={{ pathname: root, search }}>
      <Text date={day} id="dd D.M." />
    </StyledLink>
  );
};

export default React.memo(({ root }: { root: string }) => {
  const ui = React.useContext(uiContext);
  const selectedDay = ui.selectedDay;
  return (
    <Container>
      {!ui.isDateInRange(selectedDay) && (
        <DayLink day={selectedDay} selectedDay={selectedDay} />
      )}
      {ui.displayedDays.map(day => (
        <DayLink
          key={format(day, 'YYYY-MM-DD')}
          root={root}
          selectedDay={selectedDay}
          day={day}
        />
      ))}
    </Container>
  );
});
