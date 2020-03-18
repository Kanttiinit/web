import * as React from 'react';
import styled from 'styled-components';

import { PriceCategory } from '../contexts/types';
import PriceCategoryBadge from './PriceCategoryBadge';
import { Button } from './Radio';

type Props = {
  value: PriceCategory;
  onChange(value: PriceCategory): void;
};

const categories = [
  PriceCategory.student,
  PriceCategory.studentPremium,
  PriceCategory.regular
];

const Container = styled.div`
  border-radius: 50%;
  border: solid 2px var(--accent_color);
  border-radius: 1rem;
  display: inline-block;
`;

const Item = styled(Button)`
  border-radius: 0;
  border-right: 1px solid var(--gray5);
  color: ${props => (props.selected ? 'var(--gray7)' : 'var(--accent_color)')};

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
  return (
    <Container>
      {categories.map((c, i) => (
        <Item
          onClick={() => props.onChange(c)}
          selected={valueIndex >= i}
          key={c}
        >
          {c}
          <br />
          <PriceCategoryBadge noMargin priceCategory={c} />
        </Item>
      ))}
    </Container>
  );
};

export default PriceCategorySelector;
