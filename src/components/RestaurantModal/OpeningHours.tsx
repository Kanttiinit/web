import * as React from 'react';
import styled from 'styled-components';
import * as setIsoDay from 'date-fns/set_iso_day';
import * as findIndex from 'lodash/findIndex';

import { RestaurantType } from '../../contexts/types';
import { useTranslations, useFormatDate } from '../../utils/hooks';

function getOpeningHourString(hours: string[]) {
  return hours.reduce((open, hour, i) => {
    if (hour) {
      const existingIndex = findIndex(open, ['hour', hour]);
      if (existingIndex > -1) {
        open[existingIndex].endDay = i;
      } else {
        open.push({ startDay: i, hour });
      }
    }
    return open;
  }, []);
}

const OpeningHoursContainer = styled.div`
  display: table;
  position: relative;
  z-index: 1;
  white-space: nowrap;
`;

const OpeningHoursRow = styled.div`
  display: table-row;
`;

const OpeningHoursDay = styled.div`
  display: table-cell;
  text-transform: uppercase;
  opacity: 0.6;
  text-align: right;
`;

const OpeningHoursTime = styled.div`
  display: table-cell;
  padding-left: 0.4em;
`;

export interface Props {
  restaurant: RestaurantType
}

const OpeningHours = ({ restaurant }: Props) => {
  const formatDate = useFormatDate();
  const translations = useTranslations();
  return (
    <OpeningHoursContainer>
          {getOpeningHourString(restaurant.openingHours).map(hours => (
            <OpeningHoursRow key={hours.startDay}>
              <OpeningHoursDay>
                {formatDate(setIsoDay(new Date(), hours.startDay + 1), 'ddd')}
                {hours.endDay && (
                  <span>
                    &nbsp;&ndash;&nbsp;
                    {formatDate(setIsoDay(new Date(), hours.endDay + 1), 'ddd')}
                  </span>
                )}
              </OpeningHoursDay>
              <OpeningHoursTime>
                {hours.hour.replace('-', '–') || translations.closed}
              </OpeningHoursTime>
            </OpeningHoursRow>
          ))}
        </OpeningHoursContainer>
  );
};

export default OpeningHours;