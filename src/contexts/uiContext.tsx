import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import startOfDay from 'date-fns/startOfDay';


import * as times from 'lodash/times';
import * as React from 'react';

const maxDayOffset = 6;
const dateFormat = 'y-MM-dd';

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
  const now = new Date();
  return times(maxDayOffset + 1, (i: number) => addDays(now, i));
}

interface UIContextType {
  location: GeolocationCoordinates | null;
  displayedDays: Date[];
  selectedDay: Date | null;
  setLocation(
    location: GeolocationCoordinates | null | ((location: GeolocationCoordinates) => GeolocationCoordinates)
  ): void;
  updateDay(location: Location): void;
  updateDisplayedDays(): void;
}

const uiContext = React.createContext<UIContextType>({} as any);

export const UIStateProvider = (props: { children: React.ReactNode }) => {
  const [location, setLocation] = React.useState<GeolocationCoordinates | null>(null);
  const [displayedDays, setDisplayedDays] = React.useState(getDisplayedDays());
  const [date, setDate] = React.useState(startOfDay(new Date()));

  const context = React.useMemo(
    () => ({
      displayedDays,
      location,
      selectedDay: date,
      setLocation,
      updateDay(loc: Location) {
        const day = new URL(loc.href).searchParams.get('day');
        setDate(

        );
      },
      updateDisplayedDays() {
        setDisplayedDays(getDisplayedDays());
      }
    }),
    [location, displayedDays, date]
  );

  return (
    <uiContext.Provider value={context}>{props.children}</uiContext.Provider>
  );
};

export default uiContext;
