import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Draggable from 'pigeon-draggable';
import Map from 'pigeon-maps';
import * as React from 'react';
import styled from 'styled-components';

import { useTranslations } from '../../utils/hooks';
import useInput from '../../utils/useInput';
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

const CrossHair = styled.div`
  width: 22px;
  height: 22px;
  border: solid 2px var(--hearty);
  border-radius: 50%;

  &::after {
    content: ' ';
    background: var(--hearty);
    width: 4px;
    height: 4px;
    display: block;
    position: absolute;
    top: 11px;
    left: 11px;
    border-radius: 50%;
  }
`;

export default (props: FormProps) => {
  const translations = useTranslations();
  const [address, addressProps] = useInput(props.restaurant.address);
  const [latitude, latitudeProps, setLatitude] = useInput(
    props.restaurant.latitude
  );
  const [longitude, longitudeProps, setLongitude] = useInput(
    props.restaurant.longitude
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.sendChange({
      address,
      latitude,
      longitude
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <MapContainer>
        <Map defaultZoom={14} center={[latitude, longitude]}>
          <Draggable
            anchor={[latitude, longitude]}
            offset={[12, 12]}
            onDragEnd={(anchor: [number, number]) => (
              setLatitude(anchor[0]), setLongitude(anchor[1])
            )}
          >
            <CrossHair />
          </Draggable>
        </Map>
      </MapContainer>
      <LatLngContainer>
        <TextField
          label="Latitude"
          type="number"
          style={{ margin: 4 }}
          fullWidth
          disabled={props.isSending}
          {...latitudeProps}
        />
        <TextField
          label="Longitude"
          type="number"
          style={{ margin: 4 }}
          fullWidth
          disabled={props.isSending}
          {...longitudeProps}
        />
      </LatLngContainer>
      <TextField
        label={translations.address}
        style={{ margin: 4, marginBottom: 18 }}
        fullWidth
        disabled={props.isSending}
        {...addressProps}
      />
      <Button
        disabled={props.isSending}
        type="submit"
        variant="contained"
        color="primary"
      >
        {translations.send}
      </Button>{' '}
      <Button
        disabled={props.isSending}
        variant="contained"
        onClick={props.goBack}
      >
        {translations.back}
      </Button>
    </form>
  );
};
