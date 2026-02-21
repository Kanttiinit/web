import { useParams } from '@solidjs/router';
import { setISODay as setIsoDay } from 'date-fns';
import { createResource, For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import * as api from '../../api';
import { breakSmall } from '../../globalStyles';
import { HomeIcon, LocationIcon } from '../../icons';
import { computedState, resources, state } from '../../state';
import { formattedDay } from '../../utils';
import InlineIcon from '../InlineIcon';
import MenuViewer from '../MenuViewer';
import PageContainer from '../PageContainer';
import PriceCategoryBadge from '../PriceCategoryBadge';
import MapComponent from './Map';

function getOpeningHourString(hours: string[]) {
  return hours.reduce(
    (open, hour, i) => {
      if (hour) {
        const existingIndex = open.findIndex(i => i.hour === hour);
        if (existingIndex > -1) {
          open[existingIndex].endDay = i;
        } else {
          open.push({ startDay: i, hour });
        }
      }
      return open;
    },
    [] as { startDay: number; endDay?: number; hour: string }[],
  );
}

const Card = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  border: solid 1px var(--border-subtle);
  box-shadow: 0px 1px 2px 0px rgba(50, 50, 50, 0.1);
  margin-bottom: 0.75rem;
  overflow: hidden;
`;

const Info = styled(Card)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.5em;
  padding: 0.75rem 1rem;

  @media (max-width: ${breakSmall}) {
    font-size: 0.7em;
    align-items: flex-start;
  }
`;

const MenuCard = styled(Card)`
  padding: 0.75rem 1rem;
`;

const MapCard = styled(Card)`
  padding: 0;
`;

const PriceContainer = styled.div`
  padding: 0.25rem;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;

  @media (max-width: ${breakSmall}) {
    flex-direction: column;
  }
`;

const MetaLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: 0.3em 0.75em 0.3em 0.55em;
  color: var(--text-secondary);
  font-weight: 500;
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  &:hover,
  &:focus {
    background: var(--bg-interactive);
    border-color: var(--border);
    color: var(--text-primary);
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
        id: params.id,
      };
    },
    async source => {
      const restaurant = (resources.restaurants[0]() || []).find(
        r => r.id === Number(source.id),
      );
      if (restaurant) {
        return restaurant;
      }
      const result = await api.getRestaurantsByIds(
        [Number(source.id)],
        source.lang,
      );
      if (result.length) {
        return result[0];
      }
    },
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
                  restaurant.address,
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
              <PriceContainer>
                <PriceCategoryBadge priceCategory={restaurant.priceCategory} />
              </PriceContainer>
            </LinkContainer>
            <OpeningHoursContainer>
              <For each={getOpeningHourString(restaurant.openingHours)}>
                {hours => {
                  const startDate = formattedDay(
                    setIsoDay(new Date(), hours.startDay + 1),
                    'EEEEEE',
                  );
                  const endDate = formattedDay(
                    setIsoDay(new Date(), (hours.endDay || 0) + 1),
                    'EEEEEE',
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
          <MenuCard>
            <MenuViewer showCopyButton restaurantId={restaurant.id} />
          </MenuCard>
          <MapCard>
            <MapComponent
              restaurant={restaurant}
              restaurantPoint={[restaurant.latitude, restaurant.longitude]}
              userPoint={
                state.location
                  ? [state.location.latitude, state.location.longitude]
                  : undefined
              }
            />
          </MapCard>
        </PageContainer>
      )}
    </Show>
  );
};

export default RestaurantModal;
