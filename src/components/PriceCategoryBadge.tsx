import * as times from 'lodash/times';
import * as React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import styled from 'styled-components';

import { PriceCategory } from '../contexts/types';
import { useTranslations } from '../utils/hooks';
import Tooltip from './Tooltip';

type Props = {
  priceCategory: PriceCategory;
  noMargin?: boolean;
};

const categories = [
  PriceCategory.student,
  PriceCategory.studentPremium,
  PriceCategory.regular
];

const Container = styled.span<Props>`
  font-size: 0.9rem;
  ${props => !props.noMargin && 'margin-left: 0.25rem;'}
  color: var(--gray4);
  padding-left: 6px;
  vertical-align: -1px;

  svg {
    margin-left: -6px;
  }
`;

const PriceCategoryBadge = (props: Props) => {
  const translations = useTranslations();
  return (
    <Tooltip text={translations[props.priceCategory]}>
      <Container {...props}>
        {times(categories.indexOf(props.priceCategory) + 1, (i: number) => (
          <MdAttachMoney key={i} />
        ))}
      </Container>
    </Tooltip>
  );
};

export default PriceCategoryBadge;
