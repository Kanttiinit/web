import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';

import useFeedback from '../../utils/useFeedback';
import useInput from '../../utils/useInput';
import Text from '../Text';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
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
      props.setDone();
    }
  }, [sent]);

  React.useEffect(() => {
    props.setError(error);
  }, [error]);

  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="E-mail"
        style={{ margin: 4 }}
        fullWidth
        type="email"
        {...emailProps}
      />
      <TextField
        label="Message"
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
        variant="contained"
        color="primary"
      >
        {sending ? <Text id="sending" /> : <Text id="send" />}
      </Button>{' '}
      <Button variant="contained" onClick={props.goBack}>
        <Text id="back" />
      </Button>
    </form>
  );
};
