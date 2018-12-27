import * as React from 'react';

import { preferenceStore } from '../../store';
import { properties } from '../../utils/translations';
import Tooltip from '../Tooltip';
import styled from 'styled-components';

const ClickTrap = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  @media (hover: none) {
    display: none;
  }
`;

const Container = styled(Tooltip)`
  padding: 0 0.4ch;
  cursor: pointer;
  position: relative;

  &:hover {
    color: var(--accent_color);
  }

  &:last-child {
    padding-right: 0;
  }
`;

export default ({ property }: { property: string }) => {
  const prop = properties.find(p => p.key === property);
  const propName = prop
    ? preferenceStore.lang === 'fi'
      ? prop.name_fi
      : prop.name_en
    : '';
  return (
    <Container text={propName}>
      {property}
      <ClickTrap onClick={() => preferenceStore.toggleProperty(property)} />
    </Container>
  );
};
