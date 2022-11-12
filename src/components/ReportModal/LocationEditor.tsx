import { createSignal } from 'solid-js';
import { computedState } from '../../state';
import Button from '../Button';
import Input from '../Input';
import LatLngInput from '../LatLngInput';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const [address, setAddress] = createSignal(props.restaurant.address);
  const [latLng, setLatLng] = createSignal<[number, number]>([
    props.restaurant.latitude,
    props.restaurant.longitude
  ]);

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    props.sendChange({
      address,
      latitude: latLng()[0],
      longitude: latLng()[1]
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <LatLngInput
        disabled={props.isSending}
        value={latLng()}
        onChange={setLatLng}
      />
      <Input
        value={address()}
        onChange={setAddress}
        id="address"
        label={computedState.translations().address}
        disabled={props.isSending}
      />
      <Button
        disabled={props.isSending}
        type="submit"
        color="primary"
      >
        {computedState.translations().send}
      </Button>
      &nbsp;
      <Button
        disabled={props.isSending}
        onClick={props.goBack}
        secondary
      >
        {computedState.translations().back}
      </Button>
    </form>
  );
};
