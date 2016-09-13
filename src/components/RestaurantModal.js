import React from 'react'
import GoogleMapLoader from 'react-google-maps/lib/GoogleMapLoader'
import GoogleMap from 'react-google-maps/lib/GoogleMap'
import Marker from 'react-google-maps/lib/Marker'
import moment from 'moment'
import Pin from 'react-icons/lib/md/place'
import Home from 'react-icons/lib/md/home'
import findIndex from 'lodash/findIndex'

import css from '../styles/RestaurantModal.scss'
import Text from './Text'
import mapStyle from './mapStyle.json'

const mapOptions = {
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  styles: mapStyle
}

function getOpeningHourString(hours) {
  return hours.reduce((open, hour, i) => {
    if (hour) {
      const existingIndex = findIndex(open, ['hour', hour])
      if (existingIndex > -1)
        open[existingIndex].endDay = i;
      else
        open.push({startDay: i, hour});
    }
    return open;
  }, []);
}

const RestaurantModal = ({restaurant}) => {
  const latLng = {
    lat: restaurant.latitude,
    lng: restaurant.longitude
  }
  return (
    <div className={css.container}>
      <GoogleMapLoader
        containerElement={<div className={css.map} />}
        googleMapElement={
          <GoogleMap
            defaultOptions={mapOptions}
            defaultZoom={14}
            defaultCenter={latLng}>
            <Marker position={latLng} />
          </GoogleMap>
        }/>
      <div className={css.info}>
        <h1>{restaurant.name}</h1>
        <div className={css.meta}>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`} target="_blank">
            <Pin className="inline-icon" />
            {restaurant.address}
          </a>
          <a
            href={restaurant.url} target="_blank">
            <Home className="inline-icon" />
            {restaurant.url.replace(/https?\:\/\//, '').replace(/\/$/, '')}
          </a>
        </div>
        <div className={css.openingHoursContainer}>
          {getOpeningHourString(restaurant.openingHours).map(hours =>
            <div key={hours.startDay} className={css.openingHours}>
              <span className={css.day}>
                <Text id="ddd" moment={moment().weekday((hours.startDay + 1) % 7)} />
                {hours.endDay &&
                <span>
                  &nbsp;&ndash;&nbsp;
                  <Text id="ddd" moment={moment().weekday((hours.endDay + 1) % 7)} />
                </span>
                }
              </span>
              <span className={css.hours}>{hours.hour.replace('-', '–') || <Text id="closed" />}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RestaurantModal
