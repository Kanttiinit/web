import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Draggable from 'pigeon-draggable';
import Map from 'pigeon-maps';
import * as React from 'react';
import styled from 'styled-components';

import { MdLocationOn } from 'react-icons/md';
import { langContext } from '../../contexts';
import translations from '../../utils/translations';
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
  const { lang } = React.useContext(langContext);
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
            offset={[12, 24]}
            onDragEnd={(anchor: [number, number]) => (
              setLatitude(anchor[0]), setLongitude(anchor[1])
            )}
          >
            <MdLocationOn style={{ display: 'block' }} size={24} />
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
        label={translations.address[lang]}
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
        <Text id="send" />
      </Button>{' '}
      <Button
        disabled={props.isSending}
        variant="contained"
        onClick={props.goBack}
      >
        <Text id="back" />
      </Button>
    </form>
  );
};
