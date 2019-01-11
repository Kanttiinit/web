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

export function isDateInRange(date: Date) {
  const now = startOfDay(new Date());
  const end = addDays(now, maxDayOffset);
  return (
    (isSameDay(now, date) || isBefore(now, date)) &&
    (isSameDay(date, end) || isBefore(date, end))
  );
}

export function getNewPath(date: Date) {
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
  setLocation(location: Coordinates | null): void;
  updateDay(location: Location): void;
  updateDisplayedDays(): void;
}

const uiContext = React.createContext<UIContextType>({} as any);

export const UIStateProvider = (props: { children: React.ReactNode }) => {
  const [location, setLocation] = React.useState<Coordinates | null>(null);
  const [displayedDays, setDisplayedDays] = React.useState(getDisplayedDays());
  const [date, setDate] = React.useState(startOfDay(new Date()));

  const updateDay = React.useCallback((loc: Location) => {
    const day = new URL(loc.href).searchParams.get('day');
    setDate(day ? startOfDay(parse(day)) : startOfDay(new Date()));
  }, []);

  const updateDisplayedDays = React.useCallback(
    () => setDisplayedDays(getDisplayedDays()),
    []
  );

  const context = React.useMemo(
    () => ({
      displayedDays,
      location,
      selectedDay: date,
      setLocation,
      updateDay,
      updateDisplayedDays
    }),
    [location, displayedDays, date]
  );

  return (
    <uiContext.Provider value={context}>{props.children}</uiContext.Provider>
  );
};

export default uiContext;
