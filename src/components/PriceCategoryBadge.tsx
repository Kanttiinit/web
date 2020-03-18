import * as React from 'react';
import styled from 'styled-components';
import { PriceCategory } from '../contexts/types';

type Props = {
  priceCategory: PriceCategory;
  noMargin?: boolean;
};

const getContent = (priceCategory: PriceCategory) => {
  switch (priceCategory) {
    case PriceCategory.regular:
      return '€€€';
    case PriceCategory.studentPremium:
      return '€€';
    case PriceCategory.student:
      return '€';
  }
};

const Container = styled.span<Props>`
  font-size: 0.8rem;
  font-weight: normal;
  ${props => !props.noMargin && 'margin-left: 1ch;'}
  vertical-align: 2px;
  color: var(${props => `--priceCategory_${props.priceCategory}`});
  letter-spacing: 2px;
`;

const PriceCategoryBadge = (props: Props) => {
  return <Container {...props}>{getContent(props.priceCategory)}</Container>;
};

export default PriceCategoryBadge;
