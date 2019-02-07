import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import styled from 'styled-components';

import { preferenceContext } from '../../contexts';
import { useTranslations } from '../../utils/hooks';
import useFeedback from '../../utils/useFeedback';
import PageContainer from '../PageContainer';

const Field: any = styled(TextField)`
  margin-bottom: 1em !important;
`;

const Contact = () => {
  const preferences = React.useContext(preferenceContext);
  const translations = useTranslations();
  const { sending, sent, send } = useFeedback();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const [email, message] = e.target.elements;
    send(`Email: ${email.value}\n"${message.value}"`);
  };

  return (
    <MuiThemeProvider
      theme={createMuiTheme({
        palette: {
          type: preferences.darkMode ? 'dark' : 'light'
        }
      })}
    >
      <PageContainer title={translations.contact}>
        {sent ? (
          translations.thanksForFeedback
        ) : (
          <form onSubmit={onSubmit}>
            <Field
              fullWidth
              autoFocus
              type="email"
              id="email"
              required
              label={translations.email}
              autoComplete="off"
            />
            <Field
              fullWidth
              multiline
              id="message"
              required
              label={translations.message}
              rows={10}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={sending}
              type="submit"
            >
              {sending ? translations.sending : translations.send}
            </Button>
          </form>
        )}
      </PageContainer>
    </MuiThemeProvider>
  );
};

export default Contact;
