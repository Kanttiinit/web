import TextField from '@material-ui/core/TextField';
import { Map, Draggable } from 'pigeon-maps';
import * as React from 'react';
import styled from 'styled-components';

interface Props {
  disabled?: boolean;
  value: [number, number];
  onChange(latLng: [number, number]): void;
}
const osmProvider = (x: number, y: number, z: number) => {
  const s = String.fromCharCode(97 + ((x + y + z) % 3));
  return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
};

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
  border: solid 2px var(--hearty, red);
  border-radius: 50%;

  &::after {
    content: ' ';
    background: var(--hearty, red);
    width: 4px;
    height: 4px;
    display: block;
    position: absolute;
    top: 11px;
    left: 11px;
    border-radius: 50%;
  }
`;

const LatLngInput = ({ value, onChange, disabled }: Props) => {
  return (
    <>
      <MapContainer>
        <Map defaultZoom={14} center={value} provider={osmProvider}>
          <Draggable anchor={value} offset={[12, 12]} onDragEnd={onChange}>
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
          disabled={disabled}
          value={value[0] || 0}
          onChange={e => onChange([Number(e.target.value), value[1]])}
        />
        <TextField
          label="Longitude"
          type="number"
          style={{ margin: 4 }}
          fullWidth
          disabled={disabled}
          value={value[1] || 0}
          onChange={e => onChange([value[0], Number(e.target.value)])}
        />
      </LatLngContainer>
    </>
  );
};

export default LatLngInput;
