import { For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { PriceCategory } from '../../types';
import { state } from '../../state';
import { priceCategorySettings } from '../../translations';
import { Button } from '../Radio';
import { MoneyIcon } from '../../icons';

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
  border: solid 2px var(--accent_color);
  border-radius: 4px;
  display: inline-block;
  overflow: hidden;
`;

const Item = styled(Button)`
  border-radius: 0;
  color: ${props => (props.selected ? 'var(--gray7)' : 'var(--accent_color)')};
  min-width: 3rem;
  padding-top: 0.6rem;
  
  svg {
    font-size: 1rem;

    &:first-child {
      margin-left: 0;
    }
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
              <For each={Array(i() + 1).fill(0)}>
                {() => <MoneyIcon />}
              </For>
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
