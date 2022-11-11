import { Accessor, createMemo, createSignal } from 'solid-js';
import { computedState } from '../../state';
import Button from '../Button';
import OpeningHoursInput from '../OpeningHoursInput';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const [openingHours, setOpeningHours] = createSignal<(number[] | null)[]>([]);

  const initialHours: Accessor<(number[] | null)[]> = createMemo(
    () => props.restaurant.openingHours.map(hours =>
      hours ? hours.split(' - ').map(n => Number(n.replace(':', ''))) : null
    )
  );

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    props.sendChange({ openingHours });
  };

  return (
    <form onSubmit={onSubmit}>
      <OpeningHoursInput
        defaultValue={initialHours()}
        onChange={setOpeningHours}
      />
      <br />
      <Button
        disabled={props.isSending}
        type="submit"
        color="primary"
        style={{ 'margin-right': '1em' }}
      >
        {computedState.translations().send}
      </Button>
      <Button onClick={props.goBack} type="submit">
        {computedState.translations().back}
      </Button>
    </form>
  );
};
