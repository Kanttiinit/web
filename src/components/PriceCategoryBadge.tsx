import { styled } from 'solid-styled-components';
import { StudentIcon } from '../icons';
import { computedState } from '../state';
import { PriceCategory } from '../types';

type Props = {
  priceCategory: PriceCategory;
  alwaysExpanded?: boolean;
};

const Badge = styled.span<{ priceCategory: PriceCategory }>`
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-full);
  padding: 0.2em 0.6em;
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1;
  background: var(--bg-interactive);
  color: ${props => `var(--priceCategory_${props.priceCategory})`};
  overflow: hidden;
  white-space: nowrap;

  .price-short {
    display: flex;
    align-items: center;
    max-width: 3em;
    opacity: 1;
    overflow: hidden;
    transition: max-width 0.2s ease-out, opacity 0.15s;
  }

  .price-full {
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-width 0.2s ease-out, opacity 0.15s;
  }

  &:hover .price-short,
  &[data-expanded] .price-short {
    max-width: 0;
    opacity: 0;
  }

  &:hover .price-full,
  &[data-expanded] .price-full {
    max-width: 15em;
    opacity: 1;
  }

  &[data-expanded] {
    cursor: default;
    pointer-events: none;
  }
`;

const PriceCategoryBadge = (props: Props) => {
  return (
    <Badge
      priceCategory={props.priceCategory}
      data-expanded={props.alwaysExpanded ? '' : undefined}
    >
      <span class="price-short">
        {props.priceCategory === PriceCategory.student ? (
          <StudentIcon size={13} />
        ) : props.priceCategory === PriceCategory.studentPremium ? (
          '€€'
        ) : (
          '€€€'
        )}
      </span>
      <span class="price-full">
        {computedState.translations()[props.priceCategory]}
      </span>
    </Badge>
  );
};

export default PriceCategoryBadge;
