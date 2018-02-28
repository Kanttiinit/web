import * as React from 'react'
import {Label, InputGroup, ControlGroup, ButtonGroup, Button, Intent, FormGroup} from '@blueprintjs/core'
import {get, startCase, flatten} from 'lodash'
import {set} from 'lodash/fp'

import http from '../src/utils/http'
import { Model } from './models'
import inputs from './inputs'
import toaster from './toaster'
import {Field} from './models'

export default class GenericEditor extends React.PureComponent {
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

  getBasePath = () => '/admin/' + this.props.model.name.toLowerCase()

  save = async e => {
    e.preventDefault()

    const {item} = this.state

    if (this.props.mode === 'editing') {
      await http.put(this.getBasePath() + '/' + item.id, item)
    } else {
      await http.post(this.getBasePath(), item)
    }

    this.setState({mode: undefined})
    this.props.onSuccess()
    toaster.show({message: 'The item has been saved.', intent: Intent.SUCCESS})
  }

  delete = async () => {
    if (confirm('Are you sure?')) {
      await http.delete(this.getBasePath() + '/' + this.props.item.id)
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

  renderField = (field: Field) => {
    const {item} = this.state
    const InputComponent = inputs[field.type] || inputs._
    const value = 'fields' in field ? field.fields.map(f => get(item, f.path)) : get(item, field.path)
    return (
      <React.Fragment>
        <Label text={field.title}>
          <InputComponent
            field={field}
            value={value}
            setValue={this.setValue} />
        </Label>
      </React.Fragment>
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