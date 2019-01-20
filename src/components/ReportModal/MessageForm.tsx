import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';

import useInput from '../../utils/useInput';
import Text from '../Text';
import { FormProps } from './ReportModal';

export default (props: FormProps) => {
  const [email, emailProps] = useInput('');
  const [message, messageProps] = useInput('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

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
      <Button type="submit" variant="contained" color="primary">
        <Text id="send" />
      </Button>{' '}
      <Button variant="contained" onClick={props.goBack}>
        <Text id="back" />
      </Button>
    </form>
  );
};
