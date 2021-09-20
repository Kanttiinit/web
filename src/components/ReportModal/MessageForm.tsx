import * as React from 'react';

import { useTranslations } from '../../utils/hooks';
import useFeedback from '../../utils/useFeedback';
import Button from '../Button';
import Input from '../Input';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const translations = useTranslations();
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const { sending, sent, error, send } = useFeedback();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send(
      `Feedback regarding restaurant "${props.restaurant.name}":\n"${message}"`,
      email as string
    );
  };

  React.useEffect(() => {
    if (sent) {
      props.setDone(true);
    }
  }, [sent]);

  React.useEffect(() => {
    props.setError(error);
  }, [error]);

  return (
    <form onSubmit={onSubmit}>
      <Input
        label={translations.email}
        type="email"
        id="email"
        value={email}
        onChange={setEmail}
      />
      <Input
        label={translations.message}
        required
        multiline
        id="message"
        rows={10}
        value={message}
        onChange={setMessage}
      />
      <Button
        disabled={sending}
        type="submit">
        {sending ? translations.sending : translations.send}
      </Button>
      &nbsp;
      <Button onClick={props.goBack}>
        {translations.back}
      </Button>
    </form>
  );
};
