import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';

import { useTranslations } from '../../utils/hooks';
import useInput from '../../utils/useInput';
import LatLngInput from '../LatLngInput';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const translations = useTranslations();
  const [address, addressProps] = useInput(props.restaurant.address);
  const [latLng, setLatLng] = React.useState<[number, number]>([
    props.restaurant.latitude,
    props.restaurant.longitude
  ]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.sendChange({
      address,
      latitude: latLng[0],
      longitude: latLng[1]
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <LatLngInput
        disabled={props.isSending}
        value={latLng}
        onChange={setLatLng}
      />
      <TextField
        label={translations.address}
        style={{ margin: 4, marginBottom: 18 }}
        fullWidth
        disabled={props.isSending}
        {...addressProps}
      />
      <Button
        disabled={props.isSending}
        type="submit"
        variant="contained"
        color="primary"
      >
        {translations.send}
      </Button>{' '}
      <Button
        disabled={props.isSending}
        variant="contained"
        onClick={props.goBack}
      >
        {translations.back}
      </Button>
    </form>
  );
};
