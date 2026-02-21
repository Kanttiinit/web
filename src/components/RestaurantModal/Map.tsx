import leaflet from "leaflet";
import { styled } from "solid-styled-components";
import "leaflet/dist/leaflet.css";
import { onCleanup, onMount } from "solid-js";
import { breakSmall } from "../../globalStyles";

import type { RestaurantType } from "../../types";
import restaurantLocationIcon from "./restaurant-location.png";
import userLocationIcon from "./user-location.png";

const Container = styled.div`
  border-top: 1px solid var(--gray6);
  border-bottom: 1px solid var(--gray6);
  min-height: 20rem;
  height: 20rem;
  margin: 1rem -1rem -1rem -1rem;
  overflow: hidden;

  @media (max-width: ${breakSmall}) {
    display: none;
  }
`;

const _RestaurantPin = styled.div`
  display: flex;
  align-items: center;
`;

const _RestaurantLabel = styled.span`
  font-weight: bold;
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white,
    1px 1px 0 white;
`;

interface Props {
  restaurantPoint: [number, number];
  userPoint?: [number, number];
  restaurant: RestaurantType;
}

export default function RestaurantMap(props: Props) {
  let container: HTMLDivElement | undefined;
  let map: leaflet.Map;

  onMount(() => {
    map = leaflet.map(container!).setView(props.restaurantPoint, 14);
    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(map);

    const restaurantMarker = leaflet
      .marker(props.restaurantPoint, {
        icon: leaflet.icon({
          iconUrl: restaurantLocationIcon,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      })
      .addTo(map);

    if (props.userPoint) {
      const userMarker = leaflet
        .marker(props.userPoint, {
          icon: leaflet.icon({
            iconUrl: userLocationIcon,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        })
        .addTo(map);
      map.fitBounds(
        leaflet.featureGroup([restaurantMarker, userMarker]).getBounds(),
      );
    }
  });

  onCleanup(() => {
    map.remove();
  });

  return <Container ref={container} />;
}
