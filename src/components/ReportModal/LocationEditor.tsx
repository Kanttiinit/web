import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import * as React from 'react';
import styled from 'styled-components';

import { createRestaurantChange } from '../../utils/api';
import useInput from '../../utils/useInput';
import Text from '../Text';
import { FormProps } from './ReportModal';

const LatLngContainer = styled.div`
  display: flex;

  > * {
    flex: 1;
  }
`;

const MapContainer = styled.div`
  height: 20rem;
`;

export default (props: FormProps) => {
  const [address, addressProps] = useInput(props.restaurant.address);
  const [latitude, latitudeProps] = useInput(String(props.restaurant.latitude));
  const [longitude, longitudeProps] = useInput(
    String(props.restaurant.longitude)
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.send(
      createRestaurantChange(props.restaurant.id, {
        address,
        latitude: Number(latitude),
        longitude: Number(longitude)
      })
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <MapContainer>
        <Map
          defaultZoom={14}
          center={[Number(latitude), Number(longitude)]}
        />
      </MapContainer>
      <LatLngContainer>
        <TextField
          label="Latitude"
          style={{ margin: 4 }}
          fullWidth
          {...latitudeProps}
        />
        <TextField
          label="Longitude"
          style={{ margin: 4 }}
          fullWidth
          {...longitudeProps}
        />
      </LatLngContainer>
      <TextField
        label="Address"
        style={{ margin: 4, marginBottom: 18 }}
        fullWidth
        {...addressProps}
      />
      <Button type="submit" variant="contained" color="primary">
        <Text id="send" />
      </Button>{' '}
      <Button variant="contained" onClick={props.goBack}>
        <Text id="back" />
      </Button>
    </form>
  );
};
