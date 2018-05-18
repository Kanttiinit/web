import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';

import { uiState } from '../../store';
const css = require('./DaySelector.scss');
import Text from '../Text';

type DayLinkProps = {
  day: moment.Moment;
  selectedDay: moment.Moment;
  root?: string;
};

const DayLink = ({ day, selectedDay, root }: DayLinkProps) => {
  const search = moment().isSame(day, 'day')
    ? ''
    : `?day=${day.format('YYYY-MM-DD')}`;
  const active = selectedDay.isSame(day, 'day');

  return (
    <Link
      className={active ? css.selected : ''}
      to={{ pathname: root, search }}
    >
      <Text moment={day} id="dd D.M." />
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
          key={day.format('YYYY-MM-DD')}
          root={root}
          selectedDay={selectedDay}
          day={day}
        />
      ))}
    </div>
  );
});
