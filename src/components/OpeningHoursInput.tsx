import setISODay from 'date-fns/setISODay';
import { createEffect, createSignal, For, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { state } from '../state';

import { Lang } from '../types';
import { formattedDay } from '../hooks';
import { CopyIcon } from '../icons';
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
  defaultValue: (number[] | null)[];
  disabled?: boolean;
  onChange(hours: (number[] | null)[]): void;
}

const OpeningHoursInput = (props: Props) => {
  const [openingHours, setOpeningHours] = createSignal<(string[] | null)[]>(
    []
  );
  let firstRun = true;

  createEffect(() => {
    if (firstRun) {
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
  });

  createEffect(() => {
    if (!firstRun) {
      props.onChange(
        openingHours().map(hours =>
          hours ? hours.map(h => Number(h.replace(':', ''))) : null
        )
      );
    }
  });

  onMount(() => {
    firstRun = false;
  });

  return (
    <For each={openingHours()}>
      {(times, i) => {
        const isClosed = times === null;
        const weekDayLabel = formattedDay(setISODay(new Date(), i() + 1), 'EE');

        const createDayToggler = (index: number) => (event: any) => {
          const hours = [...openingHours()];
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
          const hours = [...openingHours()];
          const dayHours = hours[dayIndex];
          if (dayHours)
            dayHours[timeIndex] = value;
          setOpeningHours(hours);
        };

        const createCopyFromPrevious = (dayIndex: number) => () => {
          const hours = [...openingHours()];
          const previous = hours[dayIndex - 1];
          if (previous)
            hours[dayIndex] = [...previous];
          setOpeningHours(hours);
        };

        return (
          <InputGroup>
            <input
              type="checkbox"
              disabled={props.disabled}
              onChange={createDayToggler(i())}
              checked={!isClosed}
              />
            <DayLabel>{weekDayLabel()}</DayLabel>
            <StyledInput
              id={`opening-time-${i()}`}
              label={state.translations.openingTime}
              pattern="[0-9]{1,}:[0-9]{2}"
              disabled={isClosed || props.disabled}
              value={isClosed ? state.translations.closed : times[0]}
              onChange={createDayTimeChanger(i(), 0)}
            />
            <StyledInput
              id={`closing-time-${i()}`}
              label={state.translations.closingTime}
              pattern="[0-9]{1,}:[0-9]{2}"
              disabled={isClosed || props.disabled}
              value={isClosed ? state.translations.closed : times[1]}
              onChange={createDayTimeChanger(i(), 1)}
            />
            <Tooltip translationKey="copyFromPreviousDay">
              <Button
                onClick={createCopyFromPrevious(i())}
                disabled={i() === 0}
              >
                <CopyIcon />
              </Button>
            </Tooltip>
          </InputGroup>
        );
      }}
    </For>
  );
};

export default OpeningHoursInput;
