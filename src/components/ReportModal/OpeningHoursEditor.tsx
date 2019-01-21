import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CopyFromPrevious from '@material-ui/icons/SubdirectoryArrowLeft';
import * as format from 'date-fns/format';
import * as enLocale from 'date-fns/locale/en';
import * as fiLocale from 'date-fns/locale/fi';
import * as setISODay from 'date-fns/set_iso_day';
import * as React from 'react';
import styled from 'styled-components';
import { langContext } from '../../contexts';
import { Lang } from '../../contexts/types';
import { createRestaurantChange } from '../../utils/api';
import translations from '../../utils/translations';
import Text from '../Text';
import Tooltip from '../Tooltip';
import { FormProps } from './ReportModal';

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;

const getWeekDayLabel = (index: number, lang: Lang) =>
  format(setISODay(new Date(), index + 1), 'dddd', {
    locale: lang === 'fi' ? fiLocale : enLocale
  });

export default (props: FormProps) => {
  const { lang } = React.useContext(langContext);

  const [openingHours, setOpeningHours] = React.useState<
    Array<string[] | null[]>
  >([]);

  React.useEffect(
    () => {
      const parsedOpeningHours = props.restaurant.openingHours.map(hours =>
        hours ? hours.split(' - ') : [null, null]
      );
      setOpeningHours(parsedOpeningHours);
    },
    [props.restaurant]
  );

  const createDayToggler = (index: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hours = [...openingHours];
    if (event.target.checked) {
      hours[index] = ['', ''];
    } else {
      hours[index] = [null, null];
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
    hours[dayIndex] = hours[dayIndex - 1];
    setOpeningHours(hours);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.send(
      createRestaurantChange(props.restaurant.id, {
        openingHours: openingHours.map(hours =>
          hours[0] === null
            ? null
            : [
                Number(hours[0].replace(':', '')),
                Number(hours[1].replace(':', ''))
              ]
        )
      })
    );
  };

  return (
    <form onSubmit={onSubmit}>
      {openingHours.map(([open, close], i) => {
        const isClosed = open === null || close === null;
        const weekDayLabel = getWeekDayLabel(i, lang);
        return (
          <InputGroup key={i}>
            <Checkbox
              disabled={props.isSending}
              onChange={createDayToggler(i)}
              checked={!isClosed}
            />
            <TextField
              label={`${weekDayLabel}, ${translations.openingTime[lang]}`}
              style={{ margin: 4 }}
              fullWidth
              margin="dense"
              disabled={isClosed || props.isSending}
              InputLabelProps={{
                shrink: true
              }}
              value={isClosed ? translations.closed[lang] : close}
              onChange={createDayTimeChanger(i, 0)}
            />
            <TextField
              label={`${weekDayLabel}, ${translations.closingTime[lang]}`}
              style={{ margin: 4 }}
              fullWidth
              margin="dense"
              disabled={isClosed || props.isSending}
              InputLabelProps={{
                shrink: true
              }}
              value={isClosed ? translations.closed[lang] : close}
              onChange={createDayTimeChanger(i, 1)}
            />
            <Tooltip translationKey="copyFromPreviousDay">
              <IconButton
                onClick={createCopyFromPrevious(i)}
                disabled={i === 0 || isClosed}
                aria-label="Copy from previous"
              >
                <CopyFromPrevious />
              </IconButton>
            </Tooltip>
          </InputGroup>
        );
      })}
      <br />
      <Button
        disabled={props.isSending}
        type="submit"
        variant="contained"
        color="primary"
      >
        <Text id="send" />
      </Button>{' '}
      <Button variant="contained" onClick={props.goBack}>
        <Text id="back" />
      </Button>
    </form>
  );
};
