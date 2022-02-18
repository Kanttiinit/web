import setISODay from 'date-fns/setISODay';
import * as React from 'react';
import { MdSubdirectoryArrowLeft as CopyIcon } from 'react-icons/md';
import styled from 'styled-components';

import { Lang } from '../contexts/types';
import { useFormatDate, useTranslations } from '../utils/hooks';
import Button from './Button';
import Input from './Input';
import Tooltip from './Tooltip';

const InputGroup = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  margin-bottom: 1rem;
`;

const DayLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: .5ch;
  width: 4ch;
`;

const StyledInput = styled(Input)`
  flex: 1;
  margin: 0 0.5rem;
`;

interface Props {
  lang?: Lang;
  defaultValue: (number[] | null)[];
  disabled?: boolean;
  onChange(hours: (number[] | null)[]): void;
}

const OpeningHoursInput = (props: Props) => {
  const translations = useTranslations();
  const formatDate = useFormatDate();
  const [openingHours, setOpeningHours] = React.useState<(string[] | null)[]>(
    []
  );
  const firstRun = React.useRef(true);

  React.useEffect(() => {
    if (firstRun.current) {
      setOpeningHours(
        props.defaultValue.map(hours => {
          if (!hours) {
            return null;
          }
          return hours.map((hour: number) =>
            String(hour).length === 4
              ? String(hour).substr(0, 2) + ':' + String(hour).substr(2)
              : String(hour)
          );
        })
      );
    }
  }, [props.defaultValue]);

  React.useEffect(() => {
    if (!firstRun.current) {
      props.onChange(
        openingHours.map(hours =>
          hours ? hours.map(h => Number(h.replace(':', ''))) : null
        )
      );
    }
  }, [openingHours]);

  React.useEffect(() => {
    firstRun.current = false;
  }, []);

  return (
    <>
      {openingHours.map((times, i) => {
        const isClosed = times === null;
        const weekDayLabel = formatDate(setISODay(new Date(), i + 1), 'EE');

        const createDayToggler = (index: number) => (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const hours = [...openingHours];
          if (event.target.checked) {
            hours[index] = ['', ''];
          } else {
            hours[index] = null;
          }
          setOpeningHours(hours);
        };

        const createDayTimeChanger = (dayIndex: number, timeIndex: number) => (
          value: string
        ) => {
          const hours = [...openingHours];
          hours[dayIndex][timeIndex] = value;
          setOpeningHours(hours);
        };

        const createCopyFromPrevious = (dayIndex: number) => () => {
          const hours = [...openingHours];
          hours[dayIndex] = [...hours[dayIndex - 1]];
          setOpeningHours(hours);
        };

        return (
          <InputGroup key={i}>
            <input
              type="checkbox"
              disabled={props.disabled}
              onChange={createDayToggler(i)}
              checked={!isClosed}
              />
            <DayLabel>{weekDayLabel}</DayLabel>
            <StyledInput
              id={`opening-time-${i}`}
              label={translations.openingTime}
              pattern="[0-9]{1,}:[0-9]{2}"
              disabled={isClosed || props.disabled}
              value={isClosed ? translations.closed : times[0]}
              onChange={createDayTimeChanger(i, 0)}
            />
            <StyledInput
              id={`closing-time-${i}`}
              label={translations.closingTime}
              pattern="[0-9]{1,}:[0-9]{2}"
              disabled={isClosed || props.disabled}
              value={isClosed ? translations.closed : times[1]}
              onChange={createDayTimeChanger(i, 1)}
            />
            <Tooltip translationKey="copyFromPreviousDay">
              <Button
                onClick={createCopyFromPrevious(i)}
                disabled={i === 0}
              >
                <CopyIcon />
              </Button>
            </Tooltip>
          </InputGroup>
        );
      })}
    </>
  );
};

export default OpeningHoursInput;
