/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import * as get from 'lodash/fp/get';
import * as set from 'lodash/fp/set';
import * as React from 'react';

import * as api from './api';
import { showMessage } from './index';
import inputs from './inputs';
import { Model } from './models';
import { Field } from './models';

interface ExportedProps {
  mode: 'creating' | 'editing';
  onSuccess: () => void;
  onCancel: () => void;
  onError?: () => void;
  item?: any;
  model: Model;
}

type Props = ExportedProps & {
  classes: any;
};

class Editor extends React.PureComponent<Props> {
  state: {
    item: any;
  } = {
    item: undefined
  };

  updateItem(props: Props) {
    const item = { ...props.item };
    delete item.createdAt;
    delete item.updatedAt;
    this.setState({ item });
  }

  save = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const { item } = this.state;

      if (this.props.mode === 'editing') {
        await api.editItem(this.props.model, item);
      } else {
        await api.createItem(this.props.model, item);
      }

      this.setState({ mode: undefined });
      this.props.onSuccess();
      showMessage('The item has been saved.');
    } catch (e) {
      showMessage('Error: ' + e.message);
    }
  };

  delete = async () => {
    if (confirm('Are you sure?')) {
      await api.deleteItem(this.props.model, this.props.item);
      this.props.onSuccess();
      showMessage('The item has been deleted.');
    }
  };

  setValue = (key: string | string[], value: any) =>
    this.setState({ item: set(key, value, this.state.item) });

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props: Props) {
    this.updateItem(props);
  }

  componentDidMount() {
    this.updateItem(this.props);
  }

  renderField = (field: Field, i: number) => {
    const { item } = this.state;
    const { classes } = this.props;
    const InputComponent = inputs[field.type] || inputs._;
    const value =
      'fields' in field
        ? field.fields.map(f => get(f.path, item))
        : get(field.path, item);
    return (
      <div  class={classes.margin}>
        <InputComponent field={field} value={value} setValue={this.setValue} />
      </div>
    );
  };

  render() {
    const { model, mode, onCancel } = this.props;

    if (this.state.item === undefined) {
      return null;
    }

    return (
      <>
        <DialogTitle>
          {mode === 'editing' ? 'Edit ' : 'Create new '}
          {model.name}
        </DialogTitle>
        <form onSubmit={this.save}>
          <DialogContent>{model.fields.map(this.renderField)}</DialogContent>
          <DialogActions>
            <Button type="submit" color="primary" variant="contained">
              {mode === 'creating' ? 'Create' : 'Save'}
            </Button>
            {mode === 'editing' && (
              <Button onClick={this.delete}>Delete</Button>
            )}
            <Button onClick={onCancel} color="secondary" variant="contained">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </>
    );
  }
}

export default withStyles(theme => ({
  margin: {
    marginBottom: theme.spacing(4)
  }
}))(Editor) as any;
