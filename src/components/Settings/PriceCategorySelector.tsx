import { For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { MoneyIcon } from '../../icons';
import { state } from '../../state';
import { priceCategorySettings } from '../../translations';
import { PriceCategory } from '../../types';
import { Button } from '../Radio';

type Props = {
  value: PriceCategory;
  onChange(value: PriceCategory): void;
};

const categories = [
  PriceCategory.student,
  PriceCategory.studentPremium,
  PriceCategory.regular,
];

const ButtonContainer = styled.div`
  background: var(--gray5);
  border-radius: var(--radius-full);
  padding: 3px;
  display: inline-flex;
`;

const Item = styled(Button)`
  border-radius: var(--radius-full);
  color: ${props => (props.selected ? 'var(--gray1)' : 'var(--gray3)')};
  background: ${props => (props.selected ? 'var(--gray7)' : 'transparent')};
  box-shadow: ${props => (props.selected ? 'var(--shadow-sm)' : 'none')};
  min-width: 3rem;
  padding: 0.45rem 1rem;

  svg {
    font-size: 1rem;

    &:first-child {
      margin-left: 0;
    }
  }

  :focus {
    outline: 2px solid var(--accent_color);
    outline-offset: -2px;
  }
`;

const PriceCategorySelector = (props: Props) => {
  const valueIndex = () => categories.indexOf(props.value);
  return (
    <>
      <ButtonContainer>
        <For each={categories}>
          {(c, i) => (
            <Item
              onClick={() => props.onChange(c)}
              selected={valueIndex() >= i()}
            >
              <For each={Array(i() + 1).fill(0)}>{() => <MoneyIcon />}</For>
            </Item>
          )}
        </For>
      </ButtonContainer>
      <p style={{ 'font-size': '0.8rem' }}>
        {priceCategorySettings[props.value][state.preferences.lang]}
      </p>
    </>
  );
};

export default PriceCategorySelector;
