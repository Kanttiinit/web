import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import styled from 'styled-components';

import preferenceContext from '../../contexts/preferencesContext';
import feedbackProvider, { FeedbackProps } from '../feedbackProvider';
import PageContainer from '../PageContainer';
import Text from '../Text';

const Field: any = styled(TextField)`
  margin-bottom: 1em !important;
`;

const Contact = (props: FeedbackProps) => {
  const preferences = React.useContext(preferenceContext);
  const { sending, sent } = props.feedbackState;

  const onSubmit = React.useCallback((e: any) => {
    e.preventDefault();
    const [, email, , message] = e.target.elements;
    props.onSubmitFeedback(`Email: ${email.value}\n"${message.value}"`);
  }, []);

  return (
    <MuiThemeProvider
      theme={createMuiTheme({
        palette: {
          type: preferences.darkMode ? 'dark' : 'light'
        }
      })}
    >
      <PageContainer title={<Text id="contact" />}>
        {sent ? (
          <Text element="p" id="thanksForFeedback" />
        ) : (
          <form onSubmit={onSubmit}>
            <Field
              variant="filled"
              fullWidth
              autoFocus
              type="email"
              id="email"
              required
              label="E-mail"
              autoComplete="off"
            />
            <Field
              variant="filled"
              fullWidth
              multiline
              id="message"
              required
              label="Message"
              rows={10}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={sending}
              type="submit"
            >
              {sending ? <Text id="sending" /> : <Text id="send" />}
            </Button>
          </form>
        )}
      </PageContainer>
    </MuiThemeProvider>
  );
};

export default feedbackProvider(Contact);
