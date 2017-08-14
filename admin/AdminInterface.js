import React from 'react'
import http from '../src/utils/http'
import Table from './Table'
import Ace from 'react-ace'
import get from 'lodash/get'

import 'brace/mode/json'
import 'brace/theme/github'

export default class AdminInterface extends React.PureComponent {
  state = {}

  getBasePath = () => '/admin/' + this.props.model.name.toLowerCase()
  
  create = () => this.openEditor(this.props.model.defaultFields)

  save = async () => {
    const item = JSON.parse(this.state.editorContent)

    if (this.state.mode === 'editing') {
      await http.put(this.getBasePath() + '/' + item.id, item)
    } else {
      await http.post(this.getBasePath(), item)
    }

    this.setState({mode: undefined})
    this.props.onUpdate()
    alert('Item saved!')
  }

  cancel = () => this.setState({mode: undefined})

  onEditorChange = editorContent => this.setState({editorContent})

  openEditor = (item, editing) => {
    this.setState({
      editorContent: JSON.stringify(item, null, '  '),
      mode: editing ? 'editing' : 'creating'
    })
  }

  delete = async item => {
    if (confirm('Are you sure?')) {
      await http.delete(this.getBasePath() + '/' + item.id)
      this.props.onUpdate()
      alert('Item deleted!')
    }
  }

  renderItem = item => {
    return (
      <tr key={item.id}>
        {this.props.model.tableFields.map(({key}) =>
        <td key={key}>{get(item, key)}</td>
        )}
        <td>
          &nbsp;
          <button
            onClick={() => this.openEditor(item, true)}
            className="btn btn-xs btn-warning">
            Edit
          </button>
          &nbsp;
          <button
            onClick={() => this.delete(item)}
            className="btn btn-xs btn-danger">
            Delete
          </button>
        </td>
      </tr>
    )
  }

  render() {
    const {model, items} = this.props
    const {mode, editorContent} = this.state

    if (!items) {
      return <p>Loading...</p>
    }

    return (
      <div>
        {!mode ?
        <button
          className="btn btn-primary"
          style={{margin: '1em 0'}}
          onClick={this.create}>
          Create
        </button>
        :
        <div className="panel panel-primary" style={{margin: '1em 0'}}>
          <div className="panel-heading">
            {mode === 'editing' ? 'Editing' : 'Creating'}
          </div>
          <div className="panel-body">
            <Ace
              width='100%'
              height='400px'
              onChange={this.onEditorChange}
              value={editorContent}
              theme="github"
              mode="json" />
            <br />
            <button
              onClick={this.save}
              className="btn btn-primary">
              {mode === 'editing' ? 'Update' : 'Create'}
            </button>
            &nbsp;
            <button
              onClick={this.cancel}
              className="btn btn-warning">
              Cancel
            </button>
          </div>
        </div>
        }
        <Table
          sortBy="name"
          headers={model.tableFields}
          renderItem={this.renderItem}
          data={items} />
      </div>
    )
  }
}
