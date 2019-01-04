import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import styled from 'styled-components';

import { preferenceStore } from '../../store';
import feedbackProvider, { FeedbackProps } from '../feedbackProvider';
import PageContainer from '../PageContainer';
import Text from '../Text';

const Field: any = styled(TextField)`
  margin-bottom: 1em !important;
`;

export default feedbackProvider(
  class Contact extends React.PureComponent<FeedbackProps> {
    onSubmit = (e: any) => {
      e.preventDefault();
      const [, email, , message] = e.target.elements;
      this.props.onSubmitFeedback(`Email: ${email.value}\n"${message.value}"`);
    }

    render() {
      const { sending, sent } = this.props.feedbackState;
      return (
        <MuiThemeProvider
          theme={createMuiTheme({
            palette: {
              type: preferenceStore.darkMode ? 'dark' : 'light'
            }
          })}
        >
          <PageContainer title={<Text id="contact" />}>
            {sent ? (
              <Text element="p" id="thanksForFeedback" />
            ) : (
              <form onSubmit={this.onSubmit}>
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
    }
  }
);
