import { createEffect, createSignal } from 'solid-js';
import { state } from '../../state';
import useFeedback from '../../utils/useFeedback';
import Button from '../Button';
import Input from '../Input';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const [email, setEmail] = createSignal('');
  const [message, setMessage] = createSignal('');
  const feedback = useFeedback();

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    feedback.send(
      `Feedback regarding restaurant "${props.restaurant.name}":\n"${message()}"`,
      email() as string
    );
  };

  createEffect(() => {
    if (feedback.sent) {
      props.setDone(true);
    }
  });

  createEffect(() => {
    if (feedback.error)
      props.setError(feedback.error);
  });

  return (
    <form onSubmit={onSubmit}>
      <Input
        label={state.translations.email}
        type="email"
        id="email"
        value={email()}
        onChange={setEmail}
      />
      <Input
        label={state.translations.message}
        required
        multiline
        id="message"
        rows={10}
        value={message()}
        onChange={setMessage}
      />
      <Button
        disabled={feedback.sending}
        type="submit">
        {feedback.sending ? state.translations.sending : state.translations.send}
      </Button>
      &nbsp;
      <Button onClick={props.goBack}>
        {state.translations.back}
      </Button>
    </form>
  );
};
