import * as React from 'react'
import {InputGroup, NumericInput, Button, Intent} from '@blueprintjs/core'
import * as moment from 'moment'

type InputProps = {
  value: any,
  setValue(name: string, value: any),
  name: string
}

const setInArray = (arr, i, j, value) => {
  const a = arr.concat([])
  if (!a[i]) a[i] = []
  a[i][j] = Number(value)
  return a
}

const OpeningHoursInput = ({value = [], name, setValue}) => {
  return (
    <React.Fragment>
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((weekday, i) =>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{width: '4ch', marginRight: '1ch', textAlign: 'right'}}>{weekday}</span>
        <InputGroup
          onChange={e => setValue(name, setInArray(value, i, 0, e.target.value))}
          size={5}
          value={(value[i] || [])[0] || ''} />
        <span style={{margin: '0 1ch'}}>to</span>
        <InputGroup
          onChange={e => setValue(name, setInArray(value, i, 1, e.target.value))}
          size={5}
          value={(value[i] || [])[1] || ''} />
      </div>
      )}
    </React.Fragment>
  )
}

const UrlInput = ({value, setValue, name}) => (
  <InputGroup
    onChange={e => setValue(name, e.target.value)}
    value={value}
    leftIcon="link"
    rightElement={<a target="_blank" href={value}><Button>Open</Button></a>}
    type="text" />
)

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

const AddressInput = ({value, setValue, name}) => (
  <InputGroup
    onChange={e => setValue(name, e.target.value)}
    value={value}
    leftIcon="geolocation"
    rightElement={<Button onClick={geocode(value, setValue)}>Geocode</Button>}
    type="text" />
)

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

const NumberInput = ({value, setValue, name}) => (
  <NumericInput
    onChange={e => setValue(name, e.target.value)}
    leftIcon="numbered-list"
    value={value} />
)

export default {
  openingHours: OpeningHoursInput,
  url: UrlInput,
  address: AddressInput,
  menuUrl: MenuUrlInput,
  regexp: RegExpInput,
  _: ({value, name, setValue}) =>
    <input
      onChange={e => setValue(name, e.target.value)}
      value={value}
      type="text"
      className="pt-input pt-fill" />
}