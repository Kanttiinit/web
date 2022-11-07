import * as React from 'react';
import styled, { css } from 'solid-styled-components';

import { langContext, propertyContext } from '../../contexts';
import { properties } from '../../utils/translations';
import Tooltip from '../Tooltip';

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

const Container = styled(Tooltip)<{ dimmed: boolean; highlighted: boolean }>`
  padding: 0 0.4ch;
  cursor: pointer;
  position: relative;

  ${props =>
    props.highlighted &&
    css`
      color: var(--friendly);
      font-weight: 500;
    `}

  ${props => props.dimmed && 'color: var(--gray4);'}

  &:hover {
    color: var(--accent_color);
  }

  &:last-child {
    padding-right: 0;
  }
`;

interface Props {
  property: string;
  highlighted: boolean;
  dimmed: boolean;
}

export default React.memo(({ property, dimmed, highlighted }: Props) => {
  const { lang } = React.useContext(langContext);
  const { toggleProperty } = React.useContext(propertyContext);
  const prop = properties.find(p => p.key === property);
  const propName = prop ? (lang === 'fi' ? prop.name_fi : prop.name_en) : '';
  return (
    <Container text={propName} dimmed={dimmed} highlighted={highlighted}>
      {property}
      <ClickTrap onClick={() => toggleProperty(property)} />
    </Container>
  );
});
