import * as React from 'react'
import {Table, Column, Cell, TableLoadingOption} from '@blueprintjs/table'
import {get} from 'lodash'
import {Button, Intent, Dialog} from '@blueprintjs/core'
require('@blueprintjs/table/lib/css/table.css')

import GenericEditor from './GenericEditor'
import { Model } from './models';

export default class AdminInterface extends React.PureComponent {
  state: {
    mode?: 'editing' | 'creating',
    item?: any
  } = {}

  props: {
    model: Model,
    onUpdate(),
    items: Array<any>
  }
  
  openCreateDialog = () => this.setState({mode: 'creating'})

  openEditDialog = item => this.setState({mode: 'editing', item})

  hideDialog = () => this.setState({mode: undefined})

  renderCell = (rowIndex, columnIndex) => <Cell>{get(this.props.items[rowIndex], this.props.model.tableFields[columnIndex].key)}</Cell>  

  renderActions = (rowIndex) => <Cell interactive><a href="#" onClick={() => this.openEditDialog(this.props.items[rowIndex])}>Edit</a></Cell>

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
            onSuccess={console.log}
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
          <Column key={header.key} name={header.name} cellRenderer={this.renderCell} />
          ).concat(<Column key="actions" name="Actions" cellRenderer={this.renderActions} />)}
        </Table>
      </React.Fragment>
    )
  }
}
