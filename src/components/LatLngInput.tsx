import { styled } from 'solid-styled-components';
import Input from './Input';

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
  column-count: 2;
  column-gap: 1rem;
`;

const MapContainer = styled.div`
  height: 20rem;
  margin-bottom: 1rem;
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
      {/* <MapContainer>
        <Map defaultZoom={14} center={value} provider={osmProvider}>
          <Draggable anchor={value} offset={[12, 12]} onDragEnd={onChange}>
            <CrossHair />
          </Draggable>
        </Map>
      </MapContainer> */}
      <LatLngContainer>
        <Input
          label="Latitude"
          type="number"
          id="latitude"
          disabled={disabled}
          value={value[0] || 0}
          onChange={strValue => onChange([Number(strValue), value[1]])}
        />
        <Input
          label="Longitude"
          type="number"
          id="longitude"
          disabled={disabled}
          value={value[1] || 0}
          onChange={strValue => onChange([value[0], Number(strValue)])}
        />
      </LatLngContainer>
    </>
  );
};

export default LatLngInput;
