import { setISODay as setIsoDay } from 'date-fns';
import { For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakSmall } from '../../globalStyles';
import { CloseIcon, HomeIcon, LocationIcon } from '../../icons';
import { computedState } from '../../state';
import type { RestaurantType } from '../../types';
import { formattedDay } from '../../utils';
import InlineIcon from '../InlineIcon';
import MenuViewer from '../MenuViewer';
import PriceCategoryBadge from '../PriceCategoryBadge';

function getOpeningHourString(hours: string[]) {
  return hours.reduce(
    (open, hour, i) => {
      if (hour) {
        const existingIndex = open.findIndex(item => item.hour === hour);
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

const Backdrop = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${props => (props.open ? '1' : '0')};
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
  transition: opacity 0.25s ease-out;
`;

const Sheet = styled.div<{ open: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: var(--bg-surface);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: var(--shadow-popover);
  max-height: 75vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transform: ${props => (props.open ? 'translateY(0)' : 'translateY(100%)')};
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  padding-bottom: env(safe-area-inset-bottom, 0);

  @media (min-width: ${breakSmall}) {
    max-width: 28rem;
    left: auto;
    right: 1rem;
    bottom: 1rem;
    border-radius: var(--radius-lg);
    max-height: calc(100vh - 6rem);
  }
`;

const DragHandle = styled.div`
  width: 2.5rem;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--border);
  margin: 0.6rem auto 0;
`;

const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem 0.25rem;
  position: sticky;
  top: 0;
  background: var(--bg-surface);
  z-index: 1;
`;

const RestaurantName = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background: var(--bg-interactive);
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover {
    background: var(--border-subtle);
  }
`;

const InfoSection = styled.div`
  padding: 0.5rem 1rem 0.75rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.5em;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 0.5rem;
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
  white-space: nowrap;
  margin-top: 0.5rem;
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

const MenuSection = styled.div`
  padding: 0 1rem 1rem;
  border-top: 1px solid var(--border-subtle);
`;

interface Props {
  restaurant: RestaurantType | null;
  onClose: () => void;
}

export default function RestaurantBottomSheet(props: Props) {
  const isOpen = () => props.restaurant !== null;

  return (
    <>
      <Backdrop open={isOpen()} onClick={props.onClose} />
      <Sheet open={isOpen()}>
        <Show when={props.restaurant} keyed>
          {restaurant => (
            <>
              <DragHandle />
              <SheetHeader>
                <RestaurantName>{restaurant.name}</RestaurantName>
                <CloseButton onClick={props.onClose}>
                  <CloseIcon size={16} />
                </CloseButton>
              </SheetHeader>
              <InfoSection>
                <LinkContainer>
                  <MetaLink
                    href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
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
                </LinkContainer>
                <PriceCategoryBadge
                  priceCategory={restaurant.priceCategory}
                  alwaysExpanded
                />
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
                            {hours.endDay !== undefined && (
                              <span>
                                &nbsp;&ndash;&nbsp;
                                {endDate()}
                              </span>
                            )}
                          </OpeningHoursDay>
                          <OpeningHoursTime>
                            {hours.hour.replace('-', '\u2013') ||
                              computedState.translations().closed}
                          </OpeningHoursTime>
                        </OpeningHoursRow>
                      );
                    }}
                  </For>
                </OpeningHoursContainer>
              </InfoSection>
              <MenuSection>
                <MenuViewer restaurantId={restaurant.id} />
              </MenuSection>
            </>
          )}
        </Show>
      </Sheet>
    </>
  );
}
