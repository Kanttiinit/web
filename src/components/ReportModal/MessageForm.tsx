import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';

import { useTranslations } from '../../utils/hooks';
import useFeedback from '../../utils/useFeedback';
import useInput from '../../utils/useInput';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const translations = useTranslations();
  const [email, emailProps] = useInput('');
  const [message, messageProps] = useInput('');
  const { sending, sent, error, send } = useFeedback();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send(
      `Feedback regarding restaurant "${
        props.restaurant.name
      }":\n"${message}"\nSender: ${email || 'anonymous'}`
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
      <TextField
        label={translations.email}
        style={{ margin: 4 }}
        fullWidth
        type="email"
        {...emailProps}
      />
      <TextField
        label={translations.message}
        required
        style={{ margin: 4, marginBottom: 18 }}
        multiline
        fullWidth
        rows={10}
        {...messageProps}
      />
      <Button
        disabled={sending}
        type="submit"
        variant="outlined"
        color="primary"
        style={{ marginRight: '1em' }}
      >
        {sending ? translations.sending : translations.send}
      </Button>
      <Button variant="outlined" onClick={props.goBack}>
        {translations.back}
      </Button>
    </form>
  );
};
