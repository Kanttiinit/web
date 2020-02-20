import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { uiContext } from '../../contexts';
import { isDateInRange } from '../../contexts/uiContext';
import { useFormatDate } from '../../utils/hooks';

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
  const formatDate = useFormatDate();
  const search = isSameDay(day, new Date())
    ? ''
    : `?day=${format(day, 'y-MM-dd')}`;
  const active = isSameDay(selectedDay, day);

  return (
    <StyledLink activeLink={active} to={{ pathname: root, search }}>
      {formatDate(day, 'iiiiii d.M.')}
    </StyledLink>
  );
};

export default React.memo(({ root }: { root: string }) => {
  const ui = React.useContext(uiContext);
  const selectedDay = ui.selectedDay;
  return (
    <Container>
      {!isDateInRange(selectedDay) && (
        <DayLink day={selectedDay} selectedDay={selectedDay} />
      )}
      {ui.displayedDays.map(day => (
        <DayLink
          key={format(day, 'y-MM-dd')}
          root={root}
          selectedDay={selectedDay}
          day={day}
        />
      ))}
    </Container>
  );
});
