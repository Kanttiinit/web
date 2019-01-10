import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as format from 'date-fns/format';
import * as React from 'react';

import langContext from '../../contexts/langContext';
import preferenceContext from '../../contexts/preferencesContext';
import uiContext from '../../contexts/uiContext';
import feedbackProvider, { FeedbackProps } from '../feedbackProvider';
import PageContainer from '../PageContainer';
import Text from '../Text';

type Props = FeedbackProps & { restaurantId: number };

const ReportModal = (props: Props) => {
  const preferences = React.useContext(preferenceContext);
  const { lang } = React.useContext(langContext);
  const ui = React.useContext(uiContext);

  const {
    feedbackState: { sending, sent }
  } = props;

  const onSubmit = React.useCallback(
    (e: any) => {
      e.preventDefault();
      const [, reportField, , emailField] = e.target.elements;
      props.onSubmitFeedback(
        `🤥 Incorrect data reported:

"${reportField.value}"

✉️ E-mail: ${emailField.value || 'anonymous'}
🏢 Restaurant ID: ${props.restaurantId}
📅 Day: ${format(ui.selectedDay, 'DD/MM/YYYY')}
🗺 Language: ${lang}`
      );
    },
    [props.onSubmitFeedback, props.restaurantId, ui.selectedDay, lang]
  );

  return (
    <MuiThemeProvider
      theme={createMuiTheme({
        palette: {
          type: preferences.darkMode ? 'dark' : 'light'
        }
      })}
    >
      <PageContainer title={<Text id="reportDataTitle" />}>
        {sent ? (
          <Text element="p" id="thanksForFeedback" />
        ) : (
          <form onSubmit={onSubmit}>
            <TextField
              variant="filled"
              fullWidth
              multiline
              id="report"
              required
              label={<Text id="reportLabel" />}
              style={{ marginBottom: '1em' }}
              rows={5}
              autoFocus
            />
            <TextField
              variant="filled"
              fullWidth
              type="email"
              id="email"
              style={{ marginBottom: '1em' }}
              label={<Text id="reportEmail" />}
              autoComplete="off"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={sending}
            >
              <Text id={sending ? 'reporting' : 'report'} />
            </Button>
          </form>
        )}
      </PageContainer>
    </MuiThemeProvider>
  );
};

export default feedbackProvider(ReportModal);
