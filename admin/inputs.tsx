import * as React from 'react'
import {InputGroup, Button, Intent, Switch, ButtonGroup, Label} from '@blueprintjs/core'
import {withGoogleMap, Marker, GoogleMap} from 'react-google-maps'
import * as moment from 'moment'
import * as get from 'lodash/fp/get'

import * as api from './api'
import models from './models'
import {ModelField, FieldGroup, RelationField} from './models'
import toaster from './toaster';

type InputProps = {
  value: any,
  field: ModelField,
  setValue(path: string, value: any),
}

type GroupInputProps = {
  value: Array<any>,
  field: FieldGroup,
  setValue(path: string, value: any),
}

class OpeningHoursInput extends React.PureComponent {
  props: InputProps
  
  set = (i, j, value) => {
    const arr = [...this.props.value]
    if (!arr[i]) {
      arr[i] = []
    }

    arr[i][j] = Number(value)

    if (arr[i][0] === 0 && arr[i][1] === 0) {
      arr[i] = null
    }
    this.setValue(arr)
  }

  copyFrom = which => {
    const arr = [...this.props.value]
    arr[which] = arr[which - 1]
    if (Array.isArray(arr[which])) {
      arr[which] = [...arr[which]]
    }
    this.setValue(arr)
  }

  clear = i => {
    const arr = [...this.props.value]
    arr[i] = null
    this.setValue(arr)
  }

  setValue = value => this.props.setValue(this.props.field.path, value)

  render() {
    const {value = [], setValue} = this.props

    return (
      <React.Fragment>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((weekday, i) =>
        <div key={i} style={{display: 'flex', alignItems: 'center'}}>
          <span style={{width: '4ch', marginRight: '1ch', textAlign: 'right'}}>{weekday}</span>
          <InputGroup
            onChange={e => this.set(i, 0, e.target.value)}
            size={5}
            value={(value[i] || [])[0] || ''} />
          <span style={{margin: '0 1ch'}}>to</span>
          <InputGroup
            onChange={e => this.set(i, 1, e.target.value)}
            size={5}
            value={(value[i] || [])[1] || ''} />
          <ButtonGroup minimal style={{marginLeft: '1ch'}}>
            <Button
              className="pt-small"
              onClick={() => this.clear(i)}
              icon="delete" />
            {i > 0 &&
            <Button
              className="pt-small"
              onClick={() => this.copyFrom(i)}
              icon="duplicate" />}
          </ButtonGroup>
        </div>
        )}
      </React.Fragment>
    )
  }
}

const UrlInput = ({value, setValue, field}: InputProps) =>
  <InputGroup
    onChange={e => setValue(field.path, e.target.value)}
    value={value || ''}
    leftIcon="link"
    rightElement={<a target="_blank" href={value}><Button>Open</Button></a>}
    type="text" />

const MenuUrlInput = ({value, setValue, field}: InputProps) => {
  const now = moment()
  const link = value && value.replace('%year%', now.format('YYYY')).replace('%month%', now.format('MM')).replace('%day%', now.format('DD'))
  return (
    <InputGroup
      onChange={e => setValue(field.path, e.target.value)}
      value={value || ''}
      leftIcon="link"
      rightElement={<a target="_blank" href={link}><Button>Open</Button></a>}
      type="text" />
  )
}

class AddressInput extends React.PureComponent {
  props: InputProps

  state: {loading: boolean} = {loading: false}

  geocode = (address, setValue) => () => {
    const geocoder = new google.maps.Geocoder()
    this.setState({loading: true})
    geocoder.geocode({address}, (results, status) => {
      if (results.length) {
        const {geometry} = results[0]
        setValue('latitude', geometry.location.lat())
        setValue('longitude', geometry.location.lng())
      } else {
        toaster.show({message: 'There was an error geocoding.', intent: Intent.WARNING})
      }
      this.setState({loading: false})
    })
  }

  render() {
    const {value, setValue, field} = this.props
    const {loading} = this.state

    return (
      <InputGroup
        onChange={e => setValue(field.path, e.target.value)}
        value={value || ''}
        leftIcon="geolocation"
        rightElement={<Button disabled={loading} onClick={this.geocode(value, setValue)}>Geocode</Button>}
        type="text" />
    )
  }
}


class RegExpInput extends React.PureComponent {
  props: InputProps
  state = {test: ''}

  render() {
    const {field, value, setValue} = this.props
    const {test} = this.state
    const match = !!test.match(new RegExp(value))
    return (
      <React.Fragment>
        <InputGroup
          onChange={e => setValue(field.path, e.target.value)}
          value={value || ''}
          leftIcon="code"
          type="text" />
        <InputGroup
          placeholder="Test value"
          value={test}
          intent={match ? Intent.SUCCESS : Intent.DANGER}
          leftIcon={match ? 'tick-circle' : 'error'}
          onChange={e => this.setState({test: e.target.value})} />
      </React.Fragment>
    )
  }
}

const BooleanInput = ({value, setValue, field}: InputProps) =>
  <Switch
    checked={value || false}
    onChange={(e: any) => setValue(field.path, e.target.checked)} />

const NumericInput = ({value, setValue, field}: InputProps) =>
  <InputGroup
    onChange={e => setValue(field.path, Number(e.target.value))}
    value={value || ''}
    type="number" />

const Map = withGoogleMap((props: any) =>
  <GoogleMap
    defaultCenter={new google.maps.LatLng(props.latitude, props.longitude)}
    defaultZoom={14}>
    <Marker
      draggable
      onDragEnd={({latLng}) => props.onChange(latLng.lat(), latLng.lng())}
      position={new google.maps.LatLng(props.latitude, props.longitude)} />
  </GoogleMap>
)

const LocationInput = (props: GroupInputProps) => (
  <React.Fragment>
    <Label text="Latitude" className="pt-inline">
      <NumericInput
        setValue={v => props.setValue('latitude', v)}
        value={props.value[0]}
        field={props.field.fields[0]} />
    </Label>
    <Label text="Longitude" className="pt-inline">
      <NumericInput
        setValue={v => props.setValue('longitude', v)}
        value={props.value[1]}
        field={props.field.fields[1]} />
    </Label>
    <Map
      mapElement={<div style={{height: 200}} />}
      containerElement={<div />}
      latitude={props.value[0]}
      longitude={props.value[1]}
      onChange={(lat, lon) => props.setValue('latitude', lat) || props.setValue('longitude', lon)}
      {...props} />
  </React.Fragment>
)

const TranslatedInput = (props: GroupInputProps) => (
  <React.Fragment>
    {props.field.fields.map((field, i) =>
      <Label key={field.path} text={field.title} className="pt-inline">
      {React.createElement(inputs[field.type] || inputs._, {value: props.value[i], setValue: props.setValue, field})}
      </Label>
    )}
  </React.Fragment>
)

const UpdateTypeSelect = (props: InputProps) =>
  <div className="pt-select">
    <select value={props.value} onChange={e => props.setValue(props.field.path, e.target.value)}>
      <option value="software-update">Software update</option>
      <option value="information-update">Information update</option>
      <option value="bugfix">Bug fix</option>
    </select>
  </div>

class RelationInput extends React.PureComponent {
  props: {
    value: any,
    field: RelationField,
    setValue(path: string, value: any)
  }

  state: {
    items?: Array<any>,
    loading?: boolean
  } = {
    loading: true
  }

  async fetchItems() {
    const model = models.find(m => m.key === this.props.field.relationKey)
    this.setState({loading: true})
    this.setState({
      items: await api.fetchItems(model),
      loading: false
    })
  }

  componentDidMount() {
    this.fetchItems()
  }

  render() {
    const {value, field, setValue} = this.props
    const {items, loading} = this.state
    if (loading) {
      return <span>Loading...</span>
    }
    return (
      <div className="pt-select">
        <select value={value} onChange={e => setValue(field.path, e.target.value)}>
          {items.map(item =>
          <option value={item.id}>{get(field.relationDisplayField, item)}</option>
          )}
        </select>
      </div>
    )
  }
}

const inputs: any = {
  openingHours: OpeningHoursInput,
  url: UrlInput,
  address: AddressInput,
  menuUrl: MenuUrlInput,
  regExp: RegExpInput,
  boolean: BooleanInput,
  location: LocationInput,
  number: NumericInput,
  translated: TranslatedInput,
  updateType: UpdateTypeSelect,
  relation: RelationInput,
  _: ({value, field, setValue}: InputProps) =>
    <InputGroup
      onChange={e => setValue(field.path, e.target.value)}
      value={value || ''}
      type="text" />
}

export default inputs