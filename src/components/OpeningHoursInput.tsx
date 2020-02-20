import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CopyFromPrevious from '@material-ui/icons/SubdirectoryArrowLeft';
import setISODay from 'date-fns/setISODay';
import * as React from 'react';
import styled from 'styled-components';

import { Lang } from '../contexts/types';
import { useFormatDate, useTranslations } from '../utils/hooks';
import Tooltip from './Tooltip';

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
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
    <React.Fragment>
      {openingHours.map((times, i) => {
        const isClosed = times === null;
        const weekDayLabel = formatDate(setISODay(new Date(), i + 1), 'dddd');

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
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const hours = [...openingHours];
          hours[dayIndex][timeIndex] = event.target.value;
          setOpeningHours(hours);
        };

        const createCopyFromPrevious = (dayIndex: number) => () => {
          const hours = [...openingHours];
          hours[dayIndex] = [...hours[dayIndex - 1]];
          setOpeningHours(hours);
        };

        return (
          <InputGroup key={i}>
            <Checkbox
              disabled={props.disabled}
              onChange={createDayToggler(i)}
              checked={!isClosed}
            />
            <TextField
              label={`${weekDayLabel}, ${translations.openingTime}`}
              style={{ margin: 4 }}
              fullWidth
              margin="dense"
              inputProps={{
                pattern: '[0-9]{1,}:[0-9]{2}'
              }}
              disabled={isClosed || props.disabled}
              InputLabelProps={{ shrink: true }}
              value={isClosed ? translations.closed : times[0]}
              onChange={createDayTimeChanger(i, 0)}
            />
            <TextField
              label={`${weekDayLabel}, ${translations.closingTime}`}
              style={{ margin: 4 }}
              fullWidth
              margin="dense"
              inputProps={{
                pattern: '[0-9]{1,}:[0-9]{2}'
              }}
              disabled={isClosed || props.disabled}
              InputLabelProps={{ shrink: true }}
              value={isClosed ? translations.closed : times[1]}
              onChange={createDayTimeChanger(i, 1)}
            />
            <Tooltip translationKey="copyFromPreviousDay">
              <IconButton
                onClick={createCopyFromPrevious(i)}
                disabled={i === 0}
                aria-label="Copy from previous"
              >
                <CopyFromPrevious />
              </IconButton>
            </Tooltip>
          </InputGroup>
        );
      })}
    </React.Fragment>
  );
};

export default OpeningHoursInput;
