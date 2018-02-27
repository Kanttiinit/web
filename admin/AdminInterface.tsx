import * as React from 'react'
import {Table, Column, Cell, ColumnHeaderCell, TableLoadingOption} from '@blueprintjs/table'
import {Button, Intent, Menu, MenuItem, Dialog} from '@blueprintjs/core'
import {get, orderBy} from 'lodash/fp'
require('@blueprintjs/table/lib/css/table.css')

import http from '../src/utils/http'
import GenericEditor from './GenericEditor'
import { Model } from './models';

export default class AdminInterface extends React.PureComponent {
  state: {
    mode?: 'editing' | 'creating',
    item?: any,
    sortedColumn?: number,
    sortDirection: 'asc' | 'desc',
    sortedItems: Array<any>,
    items: Array<any>,
    loading: boolean
  } = {
    sortDirection: 'asc',
    sortedItems: [],
    items: [],
    loading: false
  }

  props: {
    model: Model
  }
  
  openCreateDialog = () => this.setState({mode: 'creating', item: undefined})

  openEditDialog = item => this.setState({mode: 'editing', item})

  hideDialog = () => this.setState({mode: undefined})

  renderCell = (rowIndex, columnIndex) =>
    <Cell>
      {get(this.props.model.tableFields[columnIndex].key, this.state.sortedItems[rowIndex])}
    </Cell>

  getSortIndicator = columnIndex  => columnIndex === this.state.sortedColumn ? (this.state.sortDirection === 'asc' ? '︎︎↑' : '↓') : ''

  renderHeaderCell = columnIndex =>
    <ColumnHeaderCell
      name={this.props.model.tableFields[columnIndex].name + ' ' +  this.getSortIndicator(columnIndex)}
      menuIcon="chevron-down"
      menuRenderer={this.renderHeaderMenu} />

  sortAscending = columnIndex =>
    this.setState({sortedColumn: columnIndex, sortDirection: 'asc'}, this.sortItems)

  sortDescending = columnIndex =>
    this.setState({sortedColumn: columnIndex, sortDirection: 'desc'}, this.sortItems)

  renderHeaderMenu = columnIndex =>
    <Menu>
      <MenuItem onClick={() => this.sortAscending(columnIndex)} icon="sort-asc" text="Sort ascending" />
      <MenuItem onClick={() => this.sortDescending(columnIndex)} icon="sort-desc" text="Sort descending" />
    </Menu>

  renderActions = (rowIndex) =>
    <Cell interactive>
      <a
        href="#"
        onClick={() => this.openEditDialog(this.state.sortedItems[rowIndex])}>
        Edit
      </a>
    </Cell>

  onEditorSuccess = () => {
    this.hideDialog()
    this.fetchItems()
  }

  sortItems = (props = this.props, state = this.state) => {
    const {sortedColumn, sortDirection} = state
    const sortedItems = !!sortedColumn
      ? orderBy(props.model.tableFields[sortedColumn].key, sortDirection, state.items)
      : state.items
    this.setState({sortedItems})
  }

  fetchItems = async (props = this.props) => {
    this.setState({loading: true, items: []})
    const items = await http.get('/admin/' + props.model.key, true)
    this.setState({items, loading: false}, this.sortItems)
  }

  componentWillReceiveProps(props, state) {
    if (props.model.key !== this.props.model.key) {
      this.setState({sortedColumn: undefined, sortDirection: 'asc'}, () => {
        this.fetchItems(props)
      })
    }
  }

  componentDidMount() {
    this.fetchItems()
  }

  render() {
    const {model} = this.props
    const {mode, items, item, loading} = this.state

    return (
      <React.Fragment>
        <Dialog isOpen={!!mode} onClose={this.hideDialog}>
          <GenericEditor
            model={model}
            mode={mode}
            item={item}
            onSuccess={this.onEditorSuccess}
            onCancel={this.hideDialog} />
        </Dialog>
        <Button
          intent={Intent.PRIMARY}
          style={{margin: '1em 0'}}
          onClick={this.openCreateDialog}>
          Create
        </Button>
        <Table
          columnWidths={model.tableFields.map(f => f.width).concat(100)}
          numRows={loading ? 20 : items.length}
          loadingOptions={loading ? [TableLoadingOption.CELLS] : []}>
          {model.tableFields.map(header =>
          <Column
            key={header.key}
            columnHeaderCellRenderer={this.renderHeaderCell}
            cellRenderer={this.renderCell} />
          ).concat(<Column key="actions" name="Actions" cellRenderer={this.renderActions} />)}
        </Table>
      </React.Fragment>
    )
  }
}
