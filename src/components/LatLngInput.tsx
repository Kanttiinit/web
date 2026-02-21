import leaflet from 'leaflet';
import { createEffect, onCleanup, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import Input from './Input';
import 'leaflet/dist/leaflet.css';

interface Props {
  disabled?: boolean;
  value: [number, number];
  onChange(latLng: [number, number]): void;
}

const LatLngContainer = styled.div`
  column-count: 2;
  column-gap: 1rem;
`;

const MapContainer = styled.div`
  height: 20rem;
  margin-bottom: 1rem;
`;

const _CrossHair = styled.div`
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

const LatLngInput = (props: Props) => {
  let container: HTMLDivElement | undefined;
  let marker: leaflet.Marker;
  let map: leaflet.Map;

  onMount(() => {
    map = leaflet.map(container!).setView(props.value, 14);
    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(map);
    marker = leaflet.marker(props.value, { draggable: true }).addTo(map);
    marker.addEventListener('dragend', () => {
      const pos = marker.getLatLng();
      props.onChange([pos.lat, pos.lng]);
    });
  });

  onCleanup(() => {
    marker?.remove();
    map?.remove();
  });

  createEffect(() => {
    if (marker && map) {
      marker.setLatLng(props.value);
      map.panTo(props.value, { animate: true });
    }
  });

  return (
    <>
      <MapContainer ref={container} />
      <LatLngContainer>
        <Input
          label="Latitude"
          type="number"
          id="latitude"
          step="any"
          disabled={props.disabled}
          value={props.value[0] || 0}
          onChange={strValue =>
            props.onChange([Number(strValue), props.value[1]])
          }
        />
        <Input
          label="Longitude"
          type="number"
          id="longitude"
          step="any"
          disabled={props.disabled}
          value={props.value[1] || 0}
          onChange={strValue =>
            props.onChange([props.value[0], Number(strValue)])
          }
        />
      </LatLngContainer>
    </>
  );
};

export default LatLngInput;
