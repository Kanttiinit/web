import * as React from 'react'
import {Table, Column, Cell, ColumnHeaderCell, TableLoadingOption} from '@blueprintjs/table'
import {get, orderBy} from 'lodash'
import {Button, Intent, Menu, MenuItem, Dialog} from '@blueprintjs/core'
require('@blueprintjs/table/lib/css/table.css')

import GenericEditor from './GenericEditor'
import { Model } from './models';

export default class AdminInterface extends React.PureComponent {
  state: {
    mode?: 'editing' | 'creating',
    item?: any,
    sortedColumn?: number,
    sortDirection: 'asc' | 'desc',
    sortedItems: Array<any>
  } = {
    sortDirection: 'asc',
    sortedItems: []
  }

  props: {
    model: Model,
    onUpdate(),
    items: Array<any>
  }
  
  openCreateDialog = () => this.setState({mode: 'creating'})

  openEditDialog = item => this.setState({mode: 'editing', item})

  hideDialog = () => this.setState({mode: undefined})

  renderCell = (rowIndex, columnIndex) => <Cell>{get(this.state.sortedItems[rowIndex], this.props.model.tableFields[columnIndex].key)}</Cell>

  getSortIndicator = columnIndex  => columnIndex === this.state.sortedColumn ? (this.state.sortDirection === 'asc' ? '︎︎⬆' : '⬇︎') : ''

  renderHeaderCell = columnIndex =>
    <ColumnHeaderCell
      name={this.props.model.tableFields[columnIndex].name + this.getSortIndicator(columnIndex)}
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
    this.props.onUpdate()
  }

  sortItems = (props = this.props, state = this.state) => {
    const {sortedColumn, sortDirection} = state
    if (props.model) {
      const sortedItems = !!sortedColumn
        ? orderBy(props.items, props.model.tableFields[sortedColumn].key, sortDirection)
        : props.items;
      this.setState({sortedItems})
    }
  }

  componentWillReceiveProps(props, state) {
    this.sortItems(props, state)
  }

  componentDidMount() {
    this.sortItems()
  }

  render() {
    const {model, items} = this.props
    const {mode, item} = this.state

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
          columnWidths={model ? model.tableFields.map(f => f.width).concat(100) : []}
          numRows={items ? items.length : 20}
          loadingOptions={items ? [] : [TableLoadingOption.CELLS]}>
          {model && model.tableFields.map(header =>
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
