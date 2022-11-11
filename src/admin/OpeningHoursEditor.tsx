/* eslint-disable @typescript-eslint/no-explicit-any */
import format from 'date-fns/format';
import * as React from 'react';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { BooleanInput, DateInput, DayOfWeekSelect, PlainField } from './inputs';

interface Props {
  mode: 'create' | 'edit';
  onAction: (item?: any) => void;
  item?: any;
}

interface State {
  item?: any;
}

export default class OpeningHourDialog extends React.PureComponent<
  Props,
  State
> {
  state: State = {};

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.onAction(this.state.item);
  };

  onCancel = () => this.props.onAction();

  setValue = (path: string, value: any) => {
    this.setState(state => ({
      item: { ...state.item, [path]: value }
    }));
  };

  init = () => {
    const { mode, item } = this.props;
    const edit = mode === 'edit';

    this.setState({
      item: {
        opens: edit ? item.opens : '10:00',
        closes: edit ? item.closes : '16:00',
        closed: edit ? item.closed : false,
        dayOfWeek: edit ? item.dayOfWeek : 0,
        from: edit ? item.from : format(new Date(), 'y-MM-dd'),
        to: edit ? item.to : null,
        id: edit ? item.id : undefined
      }
    });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.mode !== this.props.mode) {
      this.init();
    }
  }

  componentDidMount() {
    this.init();
  }

  render() {
    const { mode } = this.props;
    const { item } = this.state;

    if (!item) {
      return null;
    }

    return (
      <form onSubmit={this.onSubmit}>
        <DialogTitle>
          {mode === 'edit' ? 'Edit opening hour' : 'Create opening hour'}
        </DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={6}>
            <Grid item>
              <DayOfWeekSelect
                value={item.dayOfWeek}
                field={{ title: 'Day of week', path: 'dayOfWeek' }}
                setValue={this.setValue}
              />
            </Grid>
            <Grid item container spacing={8} justify="center">
              <Grid item md>
                <BooleanInput
                  value={item.closed}
                  setValue={this.setValue}
                  field={{ title: 'Closed', path: 'closed' }}
                />
              </Grid>
              {!item.closed && (
                <>
                  <Grid item md>
                    <PlainField
                      field={{ title: 'Opens', path: 'opens' }}
                      value={item.opens}
                      setValue={this.setValue}
                    />
                  </Grid>
                  <Grid item md>
                    <PlainField
                      field={{ title: 'Closes', path: 'closes' }}
                      value={item.closes}
                      setValue={this.setValue}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item container spacing={8}>
              <Grid item md>
                <DateInput
                  value={item.from}
                  setValue={this.setValue}
                  field={{ title: 'Valid from', path: 'from', required: true }}
                />
              </Grid>
              <Grid item md>
                <DateInput
                  value={item.to}
                  setValue={this.setValue}
                  field={{ title: 'Valid to', path: 'to' }}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onCancel}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {mode === 'edit' ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    );
  }
}
