import { For, type JSX } from 'solid-js';
import { css, styled } from 'solid-styled-components';
import { FilledStarIcon, WalkIcon } from '../icons';
import { computedState, resources, setState, state } from '../state';
import type allTranslations from '../translations';

const iconStyles = css`
  margin-right: 0.5ch;
  vertical-align: -1px;
`;

const StyledWalkIcon = styled(WalkIcon)`
  ${iconStyles}
`;

const StarIcon = styled(FilledStarIcon)`
  ${iconStyles}
`;

interface SpecialArea {
  id: -1 | -2;
  icon: JSX.Element;
  translationKey: keyof typeof allTranslations;
}

const specialAreas: SpecialArea[] = [
  {
    icon: <StyledWalkIcon />,
    id: -2,
    translationKey: 'nearby',
  },
  {
    icon: <StarIcon />,
    id: -1,
    translationKey: 'starred',
  },
];

const AreaButton = styled.button<{ selected: boolean }>`
  width: 100%;
  border-radius: var(--radius-sm);
  padding: 0.6em 0.75em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: ${props => (props.selected ? '500' : 'inherit')};
  background: ${props => (props.selected ? 'var(--bg-interactive)' : 'transparent')};
  color: ${props => (props.selected ? 'var(--accent_color)' : 'var(--text-primary)')};
  border: none;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;

  &:hover {
    background: var(--bg-interactive);
  }

  &:focus {
    outline: 2px solid var(--accent_color);
    outline-offset: -2px;
  }
`;

const Checkmark = styled.span`
  color: var(--accent_color);
  font-size: 0.9rem;
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: 4px 8px;
`;

const Area = (props: {
  area: { icon?: JSX.Element; label: JSX.Element; id: number };
  selectedAreaId: number;
  selectArea: (id: number) => void;
}) => {
  const selected = () => props.selectedAreaId === props.area.id;
  return (
    <AreaButton
      onKeyDown={(e: KeyboardEvent) =>
        e.key === 'Enter' && props.selectArea(props.area.id)
      }
      onMouseUp={() => props.selectArea(props.area.id)}
      selected={selected()}
    >
      <span>
        {props.area.icon && (
          <span style={{ 'margin-right': '4px', display: 'inline-block' }}>
            {props.area.icon}
          </span>
        )}
        {props.area.label}
      </span>
      {selected() && <Checkmark>✓</Checkmark>}
    </AreaButton>
  );
};

interface Props {
  onAreaSelected?: () => void;
}

const Container = styled.menu`
  margin: 0;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  user-select: none;
`;

export default function AreaSelector(props: Props) {
  const selectArea = (areaId: number) => {
    setState('preferences', 'selectedArea', areaId);
    if (props.onAreaSelected) {
      props.onAreaSelected();
    }
  };

  const [areas] = resources.areas;

  return (
    <Container>
      <For each={specialAreas}>
        {area => (
          <Area
            selectedAreaId={state.preferences.selectedArea}
            selectArea={selectArea}
            area={{
              id: area.id,
              icon: area.icon,
              label: computedState.translations()[area.translationKey],
            }}
          />
        )}
      </For>
      <Divider />
      <For
        each={areas()
          ?.slice()
          .sort((a, b) => (a.name > b.name ? 1 : -1))}
      >
        {area => (
          <Area
            selectedAreaId={state.preferences.selectedArea}
            selectArea={selectArea}
            area={{
              id: area.id,
              label: area.name,
            }}
          />
        )}
      </For>
    </Container>
  );
}
