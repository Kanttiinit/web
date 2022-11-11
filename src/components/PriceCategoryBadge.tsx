import { For } from 'solid-js';
import { styled } from 'solid-styled-components';

import { PriceCategory } from '../types';
import { computedState } from '../state';
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
  vertical-align: -3px;
  display: inline-flex;
  margin-left: 6px;

  svg {
    margin-left: -6px;
    display: block;
  }
`;

const PriceCategoryBadge = (props: Props) => {
  return (
    <Tooltip text={computedState.translations()[props.priceCategory]}>
      <Container {...props}>
        <For each={Array(categories.length).fill(0)}>
          {(_, i) =>
          <span
            style={{
              opacity: i() <= categories.indexOf(props.priceCategory) ? 1.0 : 0.33
            }}
          >$</span>
          }
        </For>
      </Container>
    </Tooltip>
  );
};

export default PriceCategoryBadge;
