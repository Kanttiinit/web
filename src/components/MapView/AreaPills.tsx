import { For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakSmall } from '../../globalStyles';
import { computedState } from '../../state';
import type { AreaType } from '../../types';

const Container = styled.div`
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${breakSmall}) {
    padding: 0.4rem 0.5rem;
  }
`;

const Pill = styled.button<{ active: boolean }>`
  flex-shrink: 0;
  border: 1px solid ${props => (props.active ? 'var(--accent_color)' : 'var(--border-subtle)')};
  border-radius: var(--radius-full);
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  background: ${props => (props.active ? 'var(--accent_color)' : 'var(--bg-surface)')};
  color: ${props => (props.active ? '#fff' : 'var(--text-secondary)')};
  box-shadow: var(--shadow-sm);

  &:hover {
    border-color: var(--accent_color);
  }
`;

interface Props {
  areas: AreaType[];
  selectedAreaId: number | null;
  onSelect: (areaId: number | null) => void;
}

export default function AreaPills(props: Props) {
  return (
    <Container>
      <Pill
        active={props.selectedAreaId === null}
        onClick={() => props.onSelect(null)}
      >
        {computedState.translations().allAreas}
      </Pill>
      <For each={props.areas}>
        {area => (
          <Pill
            active={props.selectedAreaId === area.id}
            onClick={() => props.onSelect(area.id)}
          >
            {area.name}
          </Pill>
        )}
      </For>
    </Container>
  );
}
