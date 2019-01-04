import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as format from 'date-fns/format';
import { observer } from 'mobx-react';
import * as React from 'react';

import { preferenceStore, uiState } from '../../store';
import feedbackProvider, { FeedbackProps } from '../feedbackProvider';
import PageContainer from '../PageContainer';
import Text from '../Text';

type Props = FeedbackProps & { restaurantId: number };

export default feedbackProvider(
  observer(
    class ReportModal extends React.Component<Props, any> {
      onSubmit = (e: any) => {
        e.preventDefault();
        const [, reportField, , emailField] = e.target.elements;
        this.props.onSubmitFeedback(
          `🤥 Incorrect data reported:

"${reportField.value}"

✉️ E-mail: ${emailField.value || 'anonymous'}
🏢 Restaurant ID: ${this.props.restaurantId}
📅 Day: ${format(uiState.selectedDay, 'DD/MM/YYYY')}
🗺 Language: ${preferenceStore.lang}`
        );
      }

      render() {
        const {
          feedbackState: { sending, sent }
        } = this.props;

        return (
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                type: preferenceStore.darkMode ? 'dark' : 'light'
              }
            })}
          >
            <PageContainer title={<Text id="reportDataTitle" />}>
              {sent ? (
                <Text element="p" id="thanksForFeedback" />
              ) : (
                <form onSubmit={this.onSubmit}>
                  <TextField
                    variant="filled"
                    fullWidth
                    multiline
                    id="report"
                    required
                    label={<Text id="reportLabel" />}
                    rows={5}
                    autoFocus
                  />
                  <TextField
                    variant="filled"
                    fullWidth
                    type="email"
                    id="email"
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
      }
    }
  )
);
