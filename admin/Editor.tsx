import * as React from 'react';
import Button from '@material-ui/core/Button';
import * as get from 'lodash/fp/get';
import * as set from 'lodash/fp/set';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';

import * as api from './api';
import { Model } from './models';
import inputs from './inputs';
import { Field } from './models';
import { showMessage } from './index';

type ExportedProps = {
  mode: 'creating' | 'editing';
  onSuccess: () => void;
  onCancel: () => void;
  onError?: () => void;
  item?: any;
  model: Model;
};

class Editor extends React.PureComponent {
  props: ExportedProps & {
    classes: any;
  };

  state: {
    item: any;
  } = {
    item: {}
  };

  updateItem(props) {
    const item = { ...props.model.defaultFields, ...props.item };
    delete item.createdAt;
    delete item.updatedAt;
    this.setState({ item });
  }

  save = async e => {
    e.preventDefault();

    const { item } = this.state;

    if (this.props.mode === 'editing') {
      await api.editItem(this.props.model, item);
    } else {
      await api.createItem(this.props.model, item);
    }

    this.setState({ mode: undefined });
    this.props.onSuccess();
    showMessage('The item has been saved.');
  };

  delete = async () => {
    if (confirm('Are you sure?')) {
      await api.deleteItem(this.props.model, this.props.item);
      this.props.onSuccess();
      showMessage('The item has been deleted.');
    }
  };

  setValue = (key, value) =>
    this.setState({ item: set(key, value, this.state.item) });

  componentWillReceiveProps(props) {
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
      <div key={i} className={classes.margin}>
        <InputComponent field={field} value={value} setValue={this.setValue} />
      </div>
    );
  };

  render() {
    const { model, mode, onCancel } = this.props;

    return (
      <React.Fragment>
        <DialogTitle>
          {mode === 'editing' ? 'Edit ' : 'Create new '}
          {model.name}
        </DialogTitle>
        <form onSubmit={this.save}>
          <DialogContent>{model.fields.map(this.renderField)}</DialogContent>
          <DialogActions>
            <Button type="submit" color="primary" variant="raised">
              {mode === 'creating' ? 'Create' : 'Save'}
            </Button>
            {mode === 'editing' && (
              <Button onClick={this.delete}>Delete</Button>
            )}
            <Button onClick={onCancel} color="secondary" variant="raised">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </React.Fragment>
    );
  }
}

export default withStyles(theme => ({
  margin: {
    marginBottom: theme.spacing.unit * 4
  }
}))(Editor) as any;
