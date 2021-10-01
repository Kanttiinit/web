import * as React from 'react';
import { langContext } from '../../contexts';
import { useTranslations } from '../../utils/hooks';
import Button from '../Button';
import OpeningHoursInput from '../OpeningHoursInput';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const { lang } = React.useContext(langContext);
  const translations = useTranslations();
  const [openingHours, setOpeningHours] = React.useState<
    (number[] | null)[]
  >([]);

  const initialHours: (number[] | null)[] = React.useMemo(
    () =>
      props.restaurant.openingHours.map(hours =>
        hours ? hours.split(' - ').map(n => Number(n.replace(':', ''))) : null
      ),
    [props.restaurant]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.sendChange({ openingHours });
  };

  return (
    <form onSubmit={onSubmit}>
      <OpeningHoursInput
        lang={lang}
        defaultValue={initialHours}
        onChange={setOpeningHours}
      />
      <br />
      <Button
        disabled={props.isSending}
        type="submit"
        color="primary"
        style={{ marginRight: '1em' }}
      >
        {translations.send}
      </Button>
      <Button onClick={props.goBack} type="submit">
        {translations.back}
      </Button>
    </form>
  );
};
