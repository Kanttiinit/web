import * as times from 'lodash/times';
import * as React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import styled from 'styled-components';

import { PriceCategory } from '../contexts/types';
import { useTranslations } from '../utils/hooks';
import Tooltip from './Tooltip';

type Props = {
  priceCategory: PriceCategory;
};

const categories = [
  PriceCategory.student,
  PriceCategory.studentPremium,
  PriceCategory.regular
];

const Container = styled.span<Props>`
  font-size: 0.9rem;
  color: var(--gray1);
  vertical-align: -2px;
  display: inline-flex;
  margin-left: 6px;

  svg {
    margin-left: -6px;
    display: block;
  }
`;

const PriceCategoryBadge = (props: Props) => {
  const translations = useTranslations();
  return (
    <Tooltip text={translations[props.priceCategory]}>
      <Container {...props}>
        {times(categories.length, (i: number) => (
          <MdAttachMoney
            key={i}
            style={{
              opacity: i <= categories.indexOf(props.priceCategory) ? 1.0 : 0.33
            }}
          />
        ))}
      </Container>
    </Tooltip>
  );
};

export default PriceCategoryBadge;
