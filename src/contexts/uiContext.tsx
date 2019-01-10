import * as addDays from 'date-fns/add_days';
import * as format from 'date-fns/format';
import * as isBefore from 'date-fns/is_before';
import * as isSameDay from 'date-fns/is_same_day';
import * as parse from 'date-fns/parse';
import * as startOfDay from 'date-fns/start_of_day';
import * as times from 'lodash/times';
import * as React from 'react';

const maxDayOffset = 5;
const dateFormat = 'YYYY-MM-DD';

function isDateInRange(date: Date) {
  const now = startOfDay(new Date());
  const end = addDays(now, maxDayOffset);
  return (
    (isSameDay(now, date) || isBefore(now, date)) &&
    (isSameDay(date, end) || isBefore(date, end))
  );
}

function getNewPath(date: Date) {
  const regexp = /day=[^&$]+/;
  if (isSameDay(date, new Date())) {
    return location.pathname.replace(regexp, '');
  } else if (location.pathname.match(regexp)) {
    return location.pathname.replace(regexp, `day=${format(date, dateFormat)}`);
  }
  return `${location.pathname}?day=${format(date, dateFormat)}`;
}

function getDisplayedDays(): Date[] {
  return times(6, (i: number) => addDays(new Date(), i));
}

interface UIContextType {
  location: Coordinates | null;
  displayedDays: Date[];
  selectedDay: Date | null;
  isDateInRange: typeof isDateInRange;
  getNewPath: typeof getNewPath;
  setLocation(location: Coordinates | null): void;
  updateDay(location: Location): void;
  updateDisplayedDays(): void;
}

const uiContext = React.createContext<UIContextType>({} as any);

export const UIStateProvider = (props: { children: React.ReactNode }) => {
  const [location, setLocation] = React.useState<Coordinates | null>(null);
  const [displayedDays, setDisplayedDays] = React.useState(getDisplayedDays());
  const [date, setDate] = React.useState<Date>(null);

  const updateDay = (loc: Location) => {
    const day = new URL(loc.href).searchParams.get('day');
    setDate(day ? startOfDay(parse(day)) : null);
  };

  const updateDisplayedDays = () => setDisplayedDays(getDisplayedDays());

  return (
    <uiContext.Provider
      value={{
        displayedDays,
        getNewPath,
        isDateInRange,
        location,
        selectedDay: date || startOfDay(new Date()),
        setLocation,
        updateDay,
        updateDisplayedDays
      }}
    >
      {props.children}
    </uiContext.Provider>
  );
};

export default uiContext;
