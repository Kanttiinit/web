import * as React from 'react'
import {FormGroup, ButtonGroup, Button, Intent, Callout} from '@blueprintjs/core'
import * as get from 'lodash/fp/get'
import * as set from 'lodash/fp/set'

import * as api from './api'
import { Model } from './models'
import inputs from './inputs'
import toaster from './toaster'
import {Field} from './models'

export default class Editor extends React.PureComponent {
  props: {
    mode: 'creating' | 'editing',
    onSuccess: () => void,
    onCancel: () => void,
    onError?: () => void,
    item?: any,
    model: Model
  }

  state: {
    item: any
  } = {
    item: {}
  }

  updateItem(props) {
    const item = {...props.model.defaultFields, ...props.item}
    delete item.createdAt
    delete item.updatedAt
    this.setState({item})
  }

  save = async e => {
    e.preventDefault()

    const {item} = this.state

    if (this.props.mode === 'editing') {
      await api.editItem(this.props.model, item)
    } else {
      await api.createItem(this.props.model, item)
    }

    this.setState({mode: undefined})
    this.props.onSuccess()
    toaster.show({message: 'The item has been saved.', intent: Intent.SUCCESS})
  }

  delete = async () => {
    if (confirm('Are you sure?')) {
      await api.deleteItem(this.props.model, this.props.item)
      this.props.onSuccess()
      toaster.show({message: 'The item has been deleted.', intent: Intent.SUCCESS})
    }
  }

  setValue = (key, value) => this.setState({item: set(key, value, this.state.item)})

  componentWillReceiveProps(props) {
    this.updateItem(props)
  }
  
  componentDidMount() {
    this.updateItem(this.props)
  }

  renderField = (field: Field, i) => {
    const {item} = this.state
    const InputComponent = inputs[field.type] || inputs._
    const value = 'fields' in field ? field.fields.map(f => get(f.path, item)) : get(field.path, item)
    return (
      <Callout style={{marginBottom: '1em'}} key={i}>
        <FormGroup label={<strong>{field.title}</strong>}>
          <InputComponent
            field={field}
            value={value}
            setValue={this.setValue} />
        </FormGroup>
      </Callout>
    )
  }

  render() {
    const {model, mode, onCancel} = this.props

    return (
      <div className="pt-dialog-body">
        <h3>{mode === 'editing' ? 'Edit ' : 'Create new '}{model.name}</h3>
        <form onSubmit={this.save}>
          {model.fields.map(this.renderField)}
          <ButtonGroup>
            <Button type="submit" intent={Intent.PRIMARY}>{mode === 'creating' ? 'Create' : 'Save'}</Button>
            {mode === 'editing' && <Button onClick={this.delete} intent={Intent.DANGER}>Delete</Button>}
            <Button onClick={onCancel} intent={Intent.WARNING}>Cancel</Button>
          </ButtonGroup>
        </form>
      </div>
    )
  }
}