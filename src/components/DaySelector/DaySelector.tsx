import * as React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import * as isSameDay from 'date-fns/is_same_day';
import * as format from 'date-fns/format';

import { uiState } from '../../store';
import * as css from './DaySelector.scss';
import Text from '../Text';

type DayLinkProps = {
  day: Date;
  selectedDay: Date;
  root?: string;
};

const DayLink = ({ day, selectedDay, root }: DayLinkProps) => {
  const search = isSameDay(day, new Date())
    ? ''
    : `?day=${format(day, 'YYYY-MM-DD')}`;
  const active = isSameDay(selectedDay, day);

  return (
    <Link
      className={active ? css.selected : ''}
      to={{ pathname: root, search }}
    >
      <Text date={day} id="dd D.M." />
    </Link>
  );
};

export default observer(({ root }: { root: string }) => {
  const selectedDay = uiState.selectedDay;
  return (
    <div className={css.days}>
      {!uiState.isDateInRange(selectedDay) && (
        <DayLink day={selectedDay} selectedDay={selectedDay} />
      )}
      {uiState.displayedDays.map(day => (
        <DayLink
          key={format(day, 'YYYY-MM-DD')}
          root={root}
          selectedDay={selectedDay}
          day={day}
        />
      ))}
    </div>
  );
});
