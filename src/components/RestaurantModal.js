// @flow
import React from 'react'
import {withGoogleMap, Marker, GoogleMap} from 'react-google-maps'
import moment from 'moment'
import Pin from 'react-icons/lib/md/place'
import Home from 'react-icons/lib/md/home'
import findIndex from 'lodash/findIndex'
import {observer} from 'mobx-react'

import http from '../utils/http'
import {dataStore, uiState} from '../store'
import type {RestaurantType} from '../store/types'
import MenuViewer from './MenuViewer'
import css from '../styles/RestaurantModal.scss'
import Text from './Text'
import mapStyle from './mapStyle.json'

const mapOptions = {
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  styles: mapStyle
}

type OpeningHoursType = {|
  startDay: number,
  endDay?: number,
  hour: string
|}

function getOpeningHourString(hours) {
  return hours.reduce((open, hour, i) => {
    if (hour) {
      const existingIndex = findIndex(open, ['hour', hour])
      if (existingIndex > -1)
        open[existingIndex].endDay = i
      else
        open.push({ startDay: i, hour })
    }
    return open
  }, ([]: Array<OpeningHoursType>))
}

const fitBounds = (restaurantPoint, userPoint) => map => {
  const bounds = new window.google.maps.LatLngBounds()
  bounds.extend(restaurantPoint)
  if (map && userPoint) {
    bounds.extend(userPoint)
    map.fitBounds(bounds)
  }
}

const OpeningHours = ({openingHours}) => (
  <div className={css.openingHoursContainer}>
    {getOpeningHourString(openingHours).map(hours =>
      <div key={hours.startDay} className={css.openingHours}>
        <span className={css.day}>
          <Text id="ddd" moment={moment().weekday(hours.startDay)} />
          {hours.endDay &&
            <span>
              &nbsp;&ndash;&nbsp;
            <Text id="ddd" moment={moment().weekday(hours.endDay)} />
            </span>
          }
        </span>
        <span className={css.hours}>{hours.hour.replace('-', '–') || <Text id="closed" />}</span>
      </div>
    )}
  </div>
)

const Meta = ({restaurant}) => (
  <div className={css.meta}>
    <a href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`} target="_blank">
      <Pin className="inline-icon" />
      {restaurant.address}
    </a>
    <a href={restaurant.url} target="_blank">
      <Home className="inline-icon" />
      <Text id="homepage" />
    </a>
  </div>
)

type Props = {
  restaurantId: number
}

const Map = withGoogleMap(props =>
  <GoogleMap
    ref={fitBounds(props.restaurantPoint, props.userPoint)}
    defaultOptions={mapOptions}
    defaultZoom={14}
    defaultCenter={props.restaurantPoint}>
    <Marker
      label={props.restaurant.name}
      position={props.restaurantPoint} />
    {location &&
      <Marker
        defaultIcon={{
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAF96VFh0UmF3IHByb2ZpbGUgdHlwZSBBUFAxAABo3uNKT81LLcpMVigoyk/LzEnlUgADYxMuE0sTS6NEAwMDCwMIMDQwMDYEkkZAtjlUKNEABZgamFmaGZsZmgMxiM8FAEi2FMnxHlGkAAADqElEQVRo3t1aTWgTQRQOiuDPQfHs38GDogc1BwVtQxM9xIMexIN4EWw9iAehuQdq0zb+IYhglFovClXQU+uhIuqh3hQll3iwpyjG38Zkt5uffc4XnHaSbpLZ3dnEZOBB2H3z3jeZN+9vx+fzYPgTtCoQpdVHrtA6EH7jme+/HFFawQBu6BnWNwdGjB2BWH5P32jeb0V4B54KL5uDuW3D7Y/S2uCwvrUR4GaEuZABWS0FHhhd2O4UdN3FMJneLoRtN7Y+GMvvUw2eE2RDh3LTOnCd1vQN5XZ5BXwZMV3QqQT84TFa3zuU39sy8P8IOqHb3T8fpY1emoyMSQGDI/Bwc+0ELy6i4nLtepp2mE0jc5L3UAhMsdxut0rPJfRDN2eMY1enF8Inbmj7XbtZhunkI1rZFD/cmFMlr1PFi1/nzSdGkT5RzcAzvAOPU/kVF9s0ujqw+9mP5QgDmCbJAV7McXIeGpqS3Qg7OVs4lTfMD1Yg9QLR518mZbImFcvWC8FcyLAbsev++3YETb0tn2XAvouAvjGwd14YdCahUTCWW6QQIzzDO/CIAzKm3pf77ei23AUkVbICHr8pnDZNynMQJfYPT7wyKBzPVQG3IvCAtyTsCmRBprQpMawWnkc+q2Rbn+TK/+gmRR7qTYHXEuZkdVM0p6SdLLYqX0LItnFgBxe3v0R04b5mGzwnzIUMPiBbFkdVmhGIa5tkJ4reZvyl4Rg8p3tMBh+FEqUduVRUSTKTnieL58UDG76cc70AyMgIBxs6pMyIYV5agKT9f/ltTnJFOIhuwXOCLD6gQ/oc8AJcdtuYb09xRQN3NWULgCwhfqSk3SkaBZViRTK3EYNUSBF4Hic0Y8mM+if0HhlMlaIHbQ8Z5lszxnGuIP2zrAw8J8jkA7pkMAG79AKuPTOOcgWZeVP5AsSDjAxWegGyJoSUWAj/FBpRa0JiviSbfldMqOMPcce7UVeBLK4gkMVVBLI2phLjKlIJm8lcxMNkLuIomXOTTmc1kwYf2E+nMQdzlaTTKgoaZJWyBQ141RY0DkrK6XflAQbih1geZnhJeXu5WeEZ3mVqSkrIgCzXJaXqoh65TUuLerdtFXgQ2bYKeD1pq6hobLE86SlztXMWvaA5vPO0sYWB9p2K1iJS4ra0Fju/udsN7fWu+MDRFZ+YuuIjX1d8Zu2OD92WC9G3ub1qABktBV7vssfBMX1L7yVjZ7PLHuABb9svezS7boNDyK/b4LdX123+Au+jOmNxrkG0AAAAAElFTkSuQmCC',
          anchor: { x: 12, y: 12 },
          scaledSize: { width: 24, height: 24 }
        }}
        position={props.userPoint} />
    }
  </GoogleMap>
)

@observer
export default class RestaurantModal extends React.PureComponent {
  props: Props
  state: {
    restaurant: ?RestaurantType,
    notFound: boolean
  } = {
    restaurant: null,
    notFound: false
  }

  async fetchRestaurant(restaurantId: number) {
    let restaurant = dataStore.restaurants.data.find(r => r.id === Number(restaurantId))
    if (!restaurant) {
      const result = await http.get(`/restaurants?ids=${restaurantId}`)
      if (result.length) {
        restaurant = result[0]
      } else {
        this.setState({notFound: true})
      }
    }
    this.setState({restaurant})
  }

  componentWillReceiveProps(props: Props) {
    if (props.restaurantId !== this.props.restaurantId) {
      this.fetchRestaurant(props.restaurantId)
    }
  }

  componentDidMount() {
    this.fetchRestaurant(this.props.restaurantId)
  }

  render() {
    const {restaurant, notFound} = this.state
    if (notFound) {
      return <p>Ravintolaa ei löytynyt!</p>
    }
    if (!restaurant) {
      return null
    }
    const restaurantPoint = {
      lat: restaurant.latitude,
      lng: restaurant.longitude
    }
    const userPoint = uiState.location ? {
      lat: uiState.location.latitude,
      lng: uiState.location.longitude
    } : undefined
    return (
      <div className={css.container}>
        <div className={css.info}>
          <div>
            <h1>{restaurant.name}</h1>
            <Meta restaurant={restaurant} />
          </div>
          <OpeningHours openingHours={restaurant.openingHours} />
        </div>
        <MenuViewer restaurantId={restaurant.id} />
        <Map
          containerElement={<div className={css.mapContainer} />}
          mapElement={<div className={css.map} />}
          restaurant={restaurant}
          restaurantPoint={restaurantPoint}
          userPoint={userPoint} />
      </div>
    )
  }
}