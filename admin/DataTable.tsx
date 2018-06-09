import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Progress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import * as get from 'lodash/fp/get';
import * as orderBy from 'lodash/fp/orderBy';

import * as api from './api';
import Editor from './Editor';
import { TableModel } from './models';

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
    model: TableModel;
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

  renderValue(value: any) {
    if (typeof value === 'string') {
      if (value.startsWith('http')) {
        return (
          <a href={value} target="_blank">
            {value}
          </a>
        );
      }
    } else if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  }

  render() {
    const { model } = this.props;
    const {
      mode,
      sortedItems,
      item,
      loading,
      sortDirection,
      sortedColumn
    } = this.state;

    return (
      <React.Fragment>
        <Dialog maxWidth="sm" fullWidth open={!!mode} onClose={this.hideDialog}>
          <Editor
            model={model}
            mode={mode}
            item={item}
            onSuccess={this.onEditorSuccess}
            onCancel={this.hideDialog}
          />
        </Dialog>
        <Button
          color="primary"
          variant="raised"
          style={{ margin: '1em 0' }}
          onClick={this.openCreateDialog}
        >
          Create
        </Button>
        {loading ? (
          <Progress />
        ) : (
          <Paper>
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {model.tableFields.map(field => (
                      <TableCell key={field.key}>
                        <TableSortLabel
                          direction={sortDirection}
                          onClick={() => this.changeSort(field.key)}
                          active={sortedColumn === field.key}
                        >
                          {field.name}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedItems.map((item, i) => (
                    <TableRow
                      hover
                      onClick={() => this.openEditDialog(item)}
                      key={i}
                    >
                      {model.tableFields.map(field => (
                        <TableCell
                          padding="dense"
                          style={tdStyle}
                          key={field.key}
                        >
                          {this.renderValue(get(field.key, item))}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Paper>
        )}
      </React.Fragment>
    );
  }
}
