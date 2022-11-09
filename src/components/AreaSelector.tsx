/* eslint-disable @typescript-eslint/no-explicit-any */
import * as sortBy from 'lodash/sortBy';
import { For, JSX } from 'solid-js';
import { styled, css } from 'solid-styled-components';

import { AreaType } from '../types';
import { actions, resources, setState, state } from '../state';
import { FilledStarIcon, WalkIcon } from '../utils/icons';
import allTranslations from '../utils/translations';
import Button from './Button';


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
    translationKey: 'nearby'
  },
  {
    icon: <StarIcon />,
    id: -1,
    translationKey: 'starred'
  }
];

const AreaWrapper = styled.div`
  width: 50%;
  box-sizing: border-box;
`;

const AreaButton = styled(Button)<{ selected: boolean; }>`
  background-color: ${props =>
    props.selected ? 'var(--gray6)' : 'transparent'};
  color: inherit;
  width: 100%;
  padding: 1em 0.5em;
  border-radius: 4px;
  font-weight: inherit;
  text-align: center;
  outline: none;
  color: ${props => (props.selected ? 'var(--accent_color)' : 'var(--gray1)')};

  &:hover,
  &:focus {
    background: var(--gray5);
  }
`;

const Area = (props: {
  area: { label: JSX.Element; id: number };
  selectedAreaId: number;
  selectArea: (id: number) => void;
}) => (
  <AreaWrapper>
    <AreaButton
      onKeyDown={(e: KeyboardEvent) =>
        e.key === 'Enter' && props.selectArea(props.area.id)
      }
      onMouseUp={() => props.selectArea(props.area.id)}
      selected={props.selectedAreaId === props.area.id}
    >
      {props.area.label}
    </AreaButton>
  </AreaWrapper>
);

interface Props {
  onAreaSelected?: () => void;
}

const Container = styled.menu`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  user-select: none;
  background: var(--gray7);
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
        {area =>
          <Area
            selectedAreaId={state.preferences.selectedArea}
            selectArea={selectArea}
            area={{
              id: area.id,
              label: (
                <>
                  {area.icon}
                  {state.translations[area.translationKey]}
                </>
              )
            }}
          />
        }
      </For>
      <For each={sortBy(areas(), 'name')}>
        {(area: AreaType) =>
          <Area
            selectedAreaId={state.preferences.selectedArea}
            selectArea={selectArea}
            area={{
              id: area.id,
              label: area.name
            }}
        />
        }
      </For>
    </Container>
  );
};
