import * as React from 'react'
import {Label, Toaster, InputGroup, ControlGroup, ButtonGroup, Button, Intent} from '@blueprintjs/core'
import {get, startCase, flatten} from 'lodash'
import {set} from 'lodash/fp'

import http from '../src/utils/http'
import { Model } from './models'
import inputs from './inputs'

const toaster = Toaster.create()

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
    this.setState({item: props.item})
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
    toaster.show({message: 'Item has been saved.', intent: Intent.SUCCESS})
  }

  delete = async () => {
    if (confirm('Are you sure?')) {
      await http.delete(this.getBasePath() + '/' + this.props.item.id)
      this.props.onSuccess()
      toaster.show({message: 'Item has been deleted.', intent: Intent.SUCCESS})
    }
  }

  setValue = (key, value) => this.setState({item: set(key, value, this.state.item)})

  componentWillReceiveProps(props) {
    this.updateItem(props)
  }
  
  componentDidMount() {
    this.updateItem(this.props)
  }

  render() {
    const {model, mode, onCancel} = this.props
    const {item} = this.state

    const fields = flatten(
      Object.keys(model.defaultFields).map(field => {
        if (field.endsWith('_i18n')) {
          return Object.keys(model.defaultFields[field]).map(f => `${field}.${f}`)
        }
        return field
      })
    )
    .map(key => ({key, title: startCase(key.replace('i18n', '')), input: inputs[key] || inputs._}))

    return (
      <div className="pt-dialog-body">
        <h3>{mode === 'editing' ? 'Edit ' : 'Create new '}{model.name}</h3>
        <form onSubmit={this.save}>
          {fields.map(field =>
          <Label key={field.key} text={field.title}>
            <field.input
              name={field.key}
              value={get(item, field.key)}
              setValue={this.setValue} />
          </Label>
          )}
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