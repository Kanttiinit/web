import * as React from 'react';
import { Button, Intent, Dialog, Spinner } from '@blueprintjs/core';
import * as get from 'lodash/fp/get';
import * as orderBy from 'lodash/fp/orderBy';

import * as api from './api';
import Editor from './Editor';
import { Model } from './models';

const tdStyle: any = {
  whiteSpace: 'nowrap',
  maxWidth: '300px',
  textOverflow: 'ellipsis'
};

export default class DataTable extends React.PureComponent {
  state: {
    mode?: 'editing' | 'creating';
    item?: any;
    sortedColumn?: string;
    sortDirection: 'asc' | 'desc';
    sortedItems: Array<any>;
    items: Array<any>;
    loading: boolean;
  } = {
    sortDirection: 'asc',
    sortedItems: [],
    items: [],
    loading: false
  };

  props: {
    model: Model;
  };

  openCreateDialog = () => this.setState({ mode: 'creating', item: undefined });

  openEditDialog = item => this.setState({ mode: 'editing', item });

  hideDialog = () => this.setState({ mode: undefined });

  getSortIndicator = sortedColumn =>
    sortedColumn === this.state.sortedColumn
      ? this.state.sortDirection === 'asc'
        ? '︎︎↑'
        : '↓'
      : '';

  changeSort = columnKey => {
    const { sortedColumn, sortDirection } = this.state;
    if (sortedColumn === columnKey) {
      this.setState({
        sortDirection: sortDirection === 'asc' ? 'desc' : 'asc'
      });
    } else {
      this.setState({ sortedColumn: columnKey, sortDirection: 'asc' });
    }
  };

  onEditorSuccess = () => {
    this.hideDialog();
    this.fetchItems();
  };

  sortItems = (state = this.state) => {
    const { sortedColumn, sortDirection } = state;
    const sortedItems = sortedColumn
      ? orderBy(sortedColumn, sortDirection, state.items)
      : state.items;
    this.setState({ sortedItems });
  };

  resetSort(props = this.props) {
    this.setState({
      sortedColumn: props.model.defaultSort,
      sortDirection: 'asc'
    });
  }

  fetchItems = async (props = this.props) => {
    this.setState({ loading: true, items: [] });
    this.setState({ loading: false, items: await api.fetchItems(props.model) });
  };

  componentWillReceiveProps(props) {
    if (props.model.key !== this.props.model.key) {
      this.resetSort(props);
      this.fetchItems(props);
    }
  }

  componentWillUpdate(props, state) {
    if (
      state.sortDirection !== this.state.sortDirection ||
      state.sortedColumn !== this.state.sortedColumn ||
      state.items !== this.state.items
    ) {
      this.sortItems(state);
    }
  }

  componentDidMount() {
    this.resetSort();
    this.fetchItems();
  }

  render() {
    const { model } = this.props;
    const { mode, sortedItems, item, loading } = this.state;

    return (
      <React.Fragment>
        <Dialog isOpen={!!mode} onClose={this.hideDialog}>
          <Editor
            model={model}
            mode={mode}
            item={item}
            onSuccess={this.onEditorSuccess}
            onCancel={this.hideDialog}
          />
        </Dialog>
        <Button
          intent={Intent.PRIMARY}
          style={{ margin: '1em 0' }}
          onClick={this.openCreateDialog}
        >
          Create
        </Button>
        {loading ? (
          <Spinner />
        ) : (
          <table className="pt-html-table pt-small pt-interactive pt-html-table-striped">
            <thead>
              <tr>
                {model.tableFields.map(field => (
                  <th
                    key={field.key}
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.changeSort(field.key)}
                  >
                    {field.name}&nbsp;{this.getSortIndicator(field.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item, i) => (
                <tr onClick={() => this.openEditDialog(item)} key={i}>
                  {model.tableFields.map(field => (
                    <td style={tdStyle} key={field.key}>
                      {get(field.key, item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </React.Fragment>
    );
  }
}
