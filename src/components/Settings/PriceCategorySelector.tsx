import * as times from 'lodash/times';
import * as React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import styled from 'styled-components';
import langContext from '../../contexts/langContext';
import { PriceCategory } from '../../contexts/types';
import { priceCategorySettings } from '../../utils/translations';
import {Button} from '../Radio';

type Props = {
  value: PriceCategory;
  onChange(value: PriceCategory): void;
};

const categories = [
  PriceCategory.student,
  PriceCategory.studentPremium,
  PriceCategory.regular
];

const ButtonContainer = styled.div`
  border-radius: 50%;
  border: solid 2px var(--accent_color);
  border-radius: 1rem;
  display: inline-block;
`;

const Item = styled(Button)`
  border-radius: 0;
  border-right: 1px solid var(--gray5);
  color: ${props => (props.selected ? 'var(--gray7)' : 'var(--accent_color)')};
  padding-left: 3px;

  svg {
    margin-left: -3px;
  }

  :first-child {
    border-radius: 1em 0 0 1em;
  }

  :last-child {
    border-radius: 0 1em 1em 0;
    border-right: none;
  }

  :focus {
    background: var(--accent_color);
    border-color: transparent;
  }
`;

const PriceCategorySelector = (props: Props) => {
  const valueIndex = categories.indexOf(props.value);
  const { lang } = React.useContext(langContext);
  return (
    <>
      <ButtonContainer>
        {categories.map((c, i) => (
          <Item
            onClick={() => props.onChange(c)}
            selected={valueIndex >= i}
            key={c}
          >
            {times(i + 1, (j: number) => (
              <MdAttachMoney key={j} />
            ))}
          </Item>
        ))}
      </ButtonContainer>
      <p style={{ fontSize: '0.8rem' }}>{priceCategorySettings[props.value][lang]}</p>
    </>
  );
};

export default PriceCategorySelector;
