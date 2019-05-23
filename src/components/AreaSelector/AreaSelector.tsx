import * as sortBy from 'lodash/sortBy';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { MdDirectionsWalk, MdStar } from 'react-icons/md';
import { dataContext, preferenceContext } from '../../contexts';
import { AreaType } from '../../contexts/types';
import { useTranslations } from '../../utils/hooks';
import allTranslations from '../../utils/translations';
import Button from '../Button';

const iconStyles = css`
  margin-right: 0.5ch;
  vertical-align: -1px;
`;

const WalkIcon = styled(MdDirectionsWalk)`
  ${iconStyles}
`;

const StarIcon = styled(MdStar)`
  ${iconStyles}
`;

interface SpecialArea {
  id: -1 | -2;
  icon: React.ReactNode;
  translationKey: keyof typeof allTranslations;
}

const specialAreas: SpecialArea[] = [
  {
    icon: <WalkIcon />,
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

const AreaButton = styled(Button).attrs({
  variant: 'text'
})<{
  selected: boolean;
}>`
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

const Area = ({
  area,
  selectArea,
  selectedAreaId
}: {
  area: { label: React.ReactNode; id: number };
  selectedAreaId: number;
  selectArea: (id: number) => void;
}) => (
  <AreaWrapper>
    <AreaButton
      onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) =>
        e.key === 'Enter' && selectArea(area.id)
      }
      onMouseUp={() => selectArea(area.id)}
      selected={selectedAreaId === area.id}
    >
      {area.label}
    </AreaButton>
  </AreaWrapper>
);

interface Props {
  onAreaSelected?: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  user-select: none;
  background: var(--gray7);
`;

const AreaSelector = (props: Props & RouteComponentProps<any>) => {
  const translations = useTranslations();
  const data = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);

  const selectArea = (areaId: number) => {
    preferences.setSelectedArea(areaId);
    if (props.onAreaSelected) {
      props.onAreaSelected();
    }
  };

  return (
    <Container>
      {specialAreas.map(area => (
        <Area
          key={area.id}
          selectedAreaId={preferences.selectedArea}
          selectArea={selectArea}
          area={{
            id: area.id,
            label: (
              <>
                {area.icon}
                {translations[area.translationKey]}
              </>
            )
          }}
        />
      ))}
      {sortBy(data.areas.data, 'name').map((area: AreaType) => (
        <Area
          key={area.id}
          selectedAreaId={preferences.selectedArea}
          selectArea={selectArea}
          area={{
            id: area.id,
            label: area.name
          }}
        />
      ))}
    </Container>
  );
};

export default withRouter(AreaSelector);
