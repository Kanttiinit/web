import setISODay from 'date-fns/setISODay';
import { createEffect, createSignal, For, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { computedState } from '../state';
import { formattedDay } from '../utils';
import { CopyIcon } from '../icons';
import { TextButton } from './Button';
import Input from './Input';
import Tooltip from './Tooltip';
import { unwrap } from 'solid-js/store';

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;

  label {
    width: 7ch;
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    align-self: end;
  }
`;

const StyledInput = styled(Input)`
  flex: 1;
  margin: 0;
  min-width: 200px;
`;

interface Props {
  defaultValue: (number[] | null)[];
  disabled?: boolean;
  onChange(hours: (number[] | null)[]): void;
}

const OpeningHoursInput = (props: Props) => {
  const [openingHours, setOpeningHours] = createSignal<(string[] | null)[]>([]);

  onMount(() => {
    setOpeningHours(
      unwrap(props.defaultValue).map(hours => {
        if (!hours) {
          return null;
        }
        return hours.map((hour: number) =>
          String(hour).length === 4
            ? String(hour).substr(0, 2) + ':' + String(hour).substring(2)
            : String(hour)
        );
      })
    );
  });

  createEffect(() => {
    props.onChange(
      openingHours().map(hours =>
        hours ? hours.map(h => Number(h.replace(':', ''))) : null
      )
    );
  });

  return (
    <For each={openingHours()}>
      {(times, i) => {
        const isClosed = times === null;
        const weekDayLabel = formattedDay(setISODay(new Date(), i() + 1), 'EE');

        const changeDayAndTime = (value: string, dayIndex: number, timeIndex: number) => {
          const hours = [...openingHours()];
          const dayHours = hours[dayIndex];
          if (dayHours) dayHours[timeIndex] = value;
          setOpeningHours(hours);
        };

        return (
          <InputGroup>
            <label>
              <input
                type="checkbox"
                disabled={props.disabled}
                onChange={(event: any) => {
                  const hours = [...openingHours()];
                  if (event.target.checked) {
                    hours[i()] = ['', ''];
                  } else {
                    hours[i()] = null;
                  }
                  setOpeningHours(hours);
                }}
                checked={!isClosed}
              />
              {weekDayLabel()}
            </label>
            <StyledInput
              id={`opening-time-${i()}`}
              label={computedState.translations().openingTime}
              pattern="[0-9]{1,}:[0-9]{2}"
              disabled={isClosed || props.disabled}
              value={isClosed ? computedState.translations().closed : times[0]}
              onChange={v => changeDayAndTime(v, i(), 0)}
            />
            <StyledInput
              id={`closing-time-${i()}`}
              label={computedState.translations().closingTime}
              pattern="[0-9]{1,}:[0-9]{2}"
              disabled={isClosed || props.disabled}
              value={isClosed ? computedState.translations().closed : times[1]}
              onChange={v => changeDayAndTime(v, i(), 1)}
            />
            <Tooltip style={{"align-self":"end","padding-bottom":"0.3rem"}} translationKey="copyFromPreviousDay">
              <TextButton
                onClick={() => {
                  const hours = [...openingHours()];
                  const previous = hours[i() - 1];
                  if (previous) hours[i()] = [...previous];
                  setOpeningHours(hours);
                }}
                disabled={i() === 0}
              >
                <CopyIcon size={18} />
              </TextButton>
            </Tooltip>
          </InputGroup>
        );
      }}
    </For>
  );
};

export default OpeningHoursInput;
