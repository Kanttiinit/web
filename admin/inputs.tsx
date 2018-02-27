import * as React from 'react'
import {InputGroup, Button, Intent, Switch, ButtonGroup} from '@blueprintjs/core'
import {withGoogleMap, Marker, GoogleMap} from 'react-google-maps'
import * as moment from 'moment'

type InputProps = {
  value: any,
  setValue(name: string, value: any),
  name: string
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

  setValue = value => this.props.setValue(this.props.name, value)

  render() {
    const {value = [], name, setValue} = this.props

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

const UrlInput = ({value, setValue, name}) =>
  <InputGroup
    onChange={e => setValue(name, e.target.value)}
    value={value}
    leftIcon="link"
    rightElement={<a target="_blank" href={value}><Button>Open</Button></a>}
    type="text" />

const MenuUrlInput = ({value, setValue, name}) => {
  const now = moment()
  const link = value && value.replace('%year%', now.format('YYYY')).replace('%month%', now.format('MM')).replace('%day%', now.format('DD'))
  return (
    <InputGroup
      onChange={e => setValue(name, e.target.value)}
      value={value}
      leftIcon="link"
      rightElement={<a target="_blank" href={link}><Button>Open</Button></a>}
      type="text" />
  )
}

const geocode = (address, setValue) => () => {
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({address}, (results, status) => {
    if (results.length) {
      const {geometry} = results[0]
      setValue('latitude', geometry.location.lat())
      setValue('longitude', geometry.location.lng())
    }
  })
}

const AddressInput = ({value, setValue, name}) =>
  <InputGroup
    onChange={e => setValue(name, e.target.value)}
    value={value}
    leftIcon="geolocation"
    rightElement={<Button onClick={geocode(value, setValue)}>Geocode</Button>}
    type="text" />

class RegExpInput extends React.PureComponent {
  props: InputProps
  state = {test: ''}

  render() {
    const {name, value, setValue} = this.props
    const {test} = this.state
    const match = !!test.match(new RegExp(value))
    return (
      <React.Fragment>
        <InputGroup
          onChange={e => setValue(name, e.target.value)}
          value={value}
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

const BooleanInput = ({value, setValue, name}) =>
  <Switch checked={value} onChange={(e: any) => setValue(name, e.target.checked)} />

const NumericInput = ({value, setValue, name}) =>
  <InputGroup
    onChange={e => setValue(name, Number(e.target.value))}
    value={value}
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

const LocationInput = (props: InputProps) => (
  <React.Fragment>
    <NumericInput {...props} />
    <Map
      mapElement={<div style={{height: 200}} />}
      containerElement={<div />}
      latitude={60.123}
      longitude={props.value}
      onChange={(lat, lon) => props.setValue('latitude', lat) || props.setValue('longitude', lon)}
      {...props} />
  </React.Fragment>
)

export default {
  openingHours: OpeningHoursInput,
  url: UrlInput,
  address: AddressInput,
  menuUrl: MenuUrlInput,
  regexp: RegExpInput,
  hidden: BooleanInput,
  latitude: NumericInput,
  longitude: LocationInput,
  locationRadius: NumericInput,
  _: ({value, name, setValue}) =>
    <input
      onChange={e => setValue(name, e.target.value)}
      value={value}
      type="text"
      className="pt-input pt-fill" />
}