import { For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { computedState } from '../../state';
import type { AreaType, RestaurantType } from '../../types';

const Container = styled.div`
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  flex: 1;
  min-width: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Pill = styled.button<{ active: boolean }>`
  flex-shrink: 0;
  border: 1px solid ${props => (props.active ? 'var(--accent_color)' : 'var(--border-subtle)')};
  border-radius: var(--radius-full);
  padding: 0.3rem 0.7rem;
  font-size: 0.72rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  background: ${props => (props.active ? 'var(--accent_color)' : 'transparent')};
  color: ${props => (props.active ? '#fff' : 'var(--text-muted)')};

  &:hover {
    border-color: var(--accent_color);
  }
`;

interface Props {
  areas: AreaType[];
  selectedAreaId: number | null;
  restaurants: RestaurantType[];
  selectedRestaurant: RestaurantType | null;
  onSelectArea: (areaId: number | null) => void;
  onSelectRestaurant: (restaurant: RestaurantType) => void;
}

export default function MapPills(props: Props) {
  return (
    <Container>
      {/* Always show "All areas" pill */}
      <Pill
        active={props.selectedAreaId === null}
        onClick={() => props.onSelectArea(null)}
      >
        {computedState.translations().allAreas}
      </Pill>

      <Show
        when={props.selectedAreaId !== null}
        fallback={
          /* Overview mode: show area pills */
          <For each={props.areas}>
            {area => (
              <Pill
                active={false}
                onClick={() => props.onSelectArea(area.id)}
              >
                {area.name}
              </Pill>
            )}
          </For>
        }
      >
        {/* Area mode: show restaurant pills */}
        <For each={props.restaurants}>
          {restaurant => (
            <Pill
              active={props.selectedRestaurant?.id === restaurant.id}
              onClick={() => props.onSelectRestaurant(restaurant)}
            >
              {restaurant.name}
            </Pill>
          )}
        </For>
      </Show>
    </Container>
  );
}
