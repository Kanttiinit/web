import { computedState, state } from '../../state';
import { priceCategorySettings } from '../../translations';
import { PriceCategory } from '../../types';
import Radio from '../Radio';

type Props = {
  value: PriceCategory;
  onChange(value: PriceCategory): void;
};

const categories = [
  PriceCategory.student,
  PriceCategory.studentPremium,
  PriceCategory.regular,
];

const PriceCategorySelector = (props: Props) => {
  return (
    <>
      <Radio
        options={categories.map(c => ({
          label: computedState.translations()[c],
          value: c,
        }))}
        selected={props.value}
        onChange={props.onChange}
      />
      <p style={{ 'font-size': '0.8rem' }}>
        {priceCategorySettings[props.value][state.preferences.lang]}
      </p>
    </>
  );
};

export default PriceCategorySelector;
