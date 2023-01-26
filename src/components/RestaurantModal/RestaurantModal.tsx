import { useParams } from '@solidjs/router';
import setIsoDay from 'date-fns/setISODay';
import { createResource, For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';

import { breakSmall } from '../../globalStyles';
import { computedState, state, resources } from '../../state';
import * as api from '../../api';
import { formattedDay } from '../../utils';
import { HomeIcon, LocationIcon } from '../../icons';
import InlineIcon from '../InlineIcon';
import MenuViewer from '../MenuViewer';
import PageContainer from '../PageContainer';
import PriceCategoryBadge from '../PriceCategoryBadge';
import Map from './Map';

function getOpeningHourString(hours: string[]) {
  return hours.reduce((open, hour, i) => {
    if (hour) {
      const existingIndex = open.findIndex(i => i.hour === hour);
      if (existingIndex > -1) {
        open[existingIndex].endDay = i;
      } else {
        open.push({ startDay: i, hour });
      }
    }
    return open;
  }, [] as { startDay: number; endDay?: number; hour: string }[]);
}

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: var(--gray2);
  font-size: 0.8rem;
  line-height: 1.5em;

  @media (max-width: ${breakSmall}) {
    font-size: 0.7em;
    align-items: flex-start;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${breakSmall}) {
    flex-direction: column;
  }
`;

const MetaLink = styled.a`
  text-transform: uppercase;
  display: block;
  padding: 0.25em 0.5em;
  border-radius: 0.25em;
  margin: 0 0.5em 0.5em 0;
  transition: background 0.2s;

  &:hover,
  &:focus {
    background: var(--gray5);
  }

  svg {
    margin-right: 0.5ch;
  }

  @media (max-width: ${breakSmall}) {
    padding: 0;
  }
`;

const OpeningHoursContainer = styled.div`
  display: table;
  position: relative;
  z-index: 1;
  white-space: nowrap;
`;

const OpeningHoursRow = styled.div`
  display: table-row;
`;

const OpeningHoursDay = styled.div`
  display: table-cell;
  text-transform: uppercase;
  opacity: 0.6;
  text-align: right;
`;

const OpeningHoursTime = styled.div`
  display: table-cell;
  padding-left: 0.4em;
`;

const RestaurantModal = () => {
  const params = useParams();
  const [restaurant] = createResource(
    () => {
      return {
        lang: state.preferences.lang,
        id: params.id
      };
    },
    async source => {
      const restaurant = (resources.restaurants[0]() || []).find(
        r => r.id === Number(source.id)
      );
      if (restaurant) {
        return restaurant;
      }
      const result = await api.getRestaurantsByIds(
        [Number(source.id)],
        source.lang
      );
      if (result.length) {
        return result[0];
      }
    }
  );

  return (
    <Show
      keyed
      when={restaurant()}
      fallback={
        <PageContainer
          title={computedState.translations().restaurantNotFound}
        />
      }
    >
      {restaurant => (
        <PageContainer title={restaurant.name}>
          <Info>
            <LinkContainer>
              <MetaLink
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  restaurant.address
                )}`}
                rel="noopener"
                target="_blank"
              >
                <InlineIcon>
                  <LocationIcon />
                </InlineIcon>
                {restaurant.address}
              </MetaLink>
              <MetaLink href={restaurant.url} target="_blank">
                <InlineIcon>
                  <HomeIcon />
                </InlineIcon>
                {computedState.translations().homepage}
              </MetaLink>
              <div>
                <PriceCategoryBadge priceCategory={restaurant.priceCategory} />
              </div>
            </LinkContainer>
            <OpeningHoursContainer>
              <For each={getOpeningHourString(restaurant.openingHours)}>
                {hours => {
                  const startDate = formattedDay(
                    setIsoDay(new Date(), hours.startDay + 1),
                    'EEEEEE'
                  );
                  const endDate = formattedDay(
                    setIsoDay(new Date(), (hours.endDay || 0) + 1),
                    'EEEEEE'
                  );
                  return (
                    <OpeningHoursRow>
                      <OpeningHoursDay>
                        {startDate()}
                        {hours.endDay && (
                          <span>
                            &nbsp;&ndash;&nbsp;
                            {endDate()}
                          </span>
                        )}
                      </OpeningHoursDay>
                      <OpeningHoursTime>
                        {hours.hour.replace('-', '–') ||
                          computedState.translations().closed}
                      </OpeningHoursTime>
                    </OpeningHoursRow>
                  );
                }}
              </For>
            </OpeningHoursContainer>
          </Info>
          <MenuViewer showCopyButton restaurantId={restaurant.id} />
          <Map
            restaurant={restaurant}
            restaurantPoint={[restaurant.latitude, restaurant.longitude]}
            userPoint={
              state.location
                ? [state.location.latitude, state.location.longitude]
                : undefined
            }
          />
        </PageContainer>
      )}
    </Show>
  );
};

export default RestaurantModal;
