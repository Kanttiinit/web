import Button from '@material-ui/core/Button';

import * as React from 'react';
import { langContext } from '../../contexts';
import { useTranslations } from '../../utils/hooks';
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
        variant="outlined"
        color="primary"
        style={{ marginRight: '1em' }}
      >
        {translations.send}
      </Button>
      <Button variant="outlined" onClick={props.goBack}>
        {translations.back}
      </Button>
    </form>
  );
};
