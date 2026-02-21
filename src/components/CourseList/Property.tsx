import { styled } from 'solid-styled-components';

import { setState, state } from '../../state';
import { properties } from '../../translations';
import { getArrayWithToggled } from '../../utils';
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
    props.highlighted
      ? `
      color: var(--friendly);
      font-weight: 500;
    `
      : ''}

  ${props => (props.dimmed ? 'color: var(--gray4);' : '')}

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

export default function Property(props: Props) {
  const prop = () => properties.find(p => p.key === props.property)!;
  const propName = () =>
    prop
      ? state.preferences.lang === 'fi'
        ? prop().name_fi
        : prop().name_en
      : '';
  return (
    <Container
      text={propName()}
      dimmed={props.dimmed}
      highlighted={props.highlighted}
    >
      {props.property}
      <ClickTrap
        onClick={() =>
          setState(
            'preferences',
            'properties',
            getArrayWithToggled(state.preferences.properties, props.property),
          )
        }
      />
    </Container>
  );
}
