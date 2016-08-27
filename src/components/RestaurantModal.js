import React from 'react'
import GoogleMapLoader from 'react-google-maps/lib/GoogleMapLoader'
import GoogleMap from 'react-google-maps/lib/GoogleMap'
import Marker from 'react-google-maps/lib/Marker'
import moment from 'moment'
import Pin from 'react-icons/lib/md/place'
import Home from 'react-icons/lib/md/home'

import Text from './Text'
import mapStyle from './mapStyle.json'

const mapOptions = {
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  styles: mapStyle
}

const RestaurantModal = ({restaurant}) => {
  const latLng = {
    lat: restaurant.latitude,
    lng: restaurant.longitude
  }
  return (
    <div className="restaurant-modal">
      <GoogleMapLoader
        containerElement={<div className="restaurant-modal-map" />}
        googleMapElement={
          <GoogleMap
            defaultOptions={mapOptions}
            defaultZoom={14}
            defaultCenter={latLng}>
            <Marker position={latLng} />
          </GoogleMap>
        }/>
      <div className="restaurant-modal-info">
        <h1>{restaurant.name}</h1>
        <div className="restaurant-modal-meta">
          <a href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`} target="_blank">
            <Pin className="inline-icon" />
            {restaurant.address}
          </a>
          <a
            className="restaurant-modal-url"
            href={restaurant.url} target="_blank">
            <Home className="inline-icon" />
            {restaurant.url.replace(/https?\:\/\//, '').replace(/\/$/, '')}
          </a>
        </div>
        {restaurant.openingHours.map((hours, i) =>
          <div key={i} className="restaurant-modal-opening-hours">
            <span className="day"><Text id="ddd" moment={moment().weekday((i + 1) % 7)} /></span>
            <span className="hours">{hours || <Text id="closed" />}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantModal
