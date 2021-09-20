import * as React from 'react';

import { useTranslations } from '../../utils/hooks';
import Button from '../Button';
import Input from '../Input';
import LatLngInput from '../LatLngInput';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const translations = useTranslations();
  const [address, setAddress] = React.useState(props.restaurant.address);
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
      <Input
        value={address}
        onChange={setAddress}
        id="address"
        label={translations.address}
        disabled={props.isSending}
      />
      <Button
        disabled={props.isSending}
        type="submit"
        color="primary"
      >
        {translations.send}
      </Button>
      &nbsp;
      <Button
        disabled={props.isSending}
        onClick={props.goBack}
      >
        {translations.back}
      </Button>
    </form>
  );
};
