import { JSXElement } from 'solid-js';
import { styled } from 'solid-styled-components';

import { DarkModeChoice, HighlighOperator, Lang, Order } from '../../types';
import { computedState, setState, state } from '../../state';
import FavoriteSelector from '../FavoriteSelector';
import PageContainer from '../PageContainer';
import Radio from '../Radio';
import Toggle from '../Toggle';
import PriceCategorySelector from './PriceCategorySelector';
import PropertySelector from './PropertySelector';

interface ItemProps {
  label: JSXElement;
  children: JSXElement;
}

const ItemTitle = styled.h2`
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--gray3);
  margin-top: 2em;
`;

const Item = (props: ItemProps) => (
  <>
    <ItemTitle>{props.label}</ItemTitle>
    {props.children}
  </>
);

const orders = [Order.AUTOMATIC, Order.ALPHABET, Order.DISTANCE];

const languageOptions = [
  { label: 'Finnish', value: Lang.FI },
  { label: 'English', value: Lang.EN }
];

const Settings = () => {
  return (
    <PageContainer title={computedState.translations().settings}>
      <Item label={computedState.translations().language}>
        <Radio
          options={languageOptions}
          selected={state.preferences.lang}
          onChange={value => setState('preferences', 'lang', value)}
        />
      </Item>
      <Item label={computedState.translations().priceCategory}>
        <PriceCategorySelector
          value={state.preferences.maxPriceCategory}
          onChange={value => setState('preferences', 'maxPriceCategory', value)}
        />
      </Item>
      <Item label={computedState.translations().theme}>
        <Radio
          options={[
            {
              label: computedState.translations().default,
              value: DarkModeChoice.DEFAULT
            },
            {
              label: computedState.translations().light,
              value: DarkModeChoice.OFF
            },
            {
              label: computedState.translations().dark,
              value: DarkModeChoice.ON
            }
          ]}
          selected={state.preferences.darkMode}
          onChange={value => setState('preferences', 'darkMode', value)}
        />
      </Item>
      <Item label={computedState.translations().order}>
        <Radio
          options={orders.map(order => ({
            label: computedState.translations()[order],
            value: order
          }))}
          selected={state.preferences.order}
          onChange={value => setState('preferences', 'order', value)}
        />
      </Item>
      <Item label={computedState.translations().useLocation}>
        <Toggle
          selected={state.preferences.useLocation}
          onChange={value => setState('preferences', 'useLocation', value)}
        />
      </Item>
      <Item label={computedState.translations().highlightDiets}>
        <PropertySelector showDesiredProperties />
      </Item>
      <Item label={computedState.translations().highlightOperator}>
        <Radio
          options={[
            { label: computedState.translations().and, value: HighlighOperator.AND },
            { label: computedState.translations().or, value: HighlighOperator.OR }
          ]}
          selected={state.preferences.highlightOperator}
          onChange={value => setState('preferences', 'highlightOperator', value)}
        />
      </Item>
      <Item label={computedState.translations().avoidDiets}>
        <PropertySelector />
      </Item>
      <Item label={computedState.translations().prioritize}>
        <FavoriteSelector />
      </Item>
    </PageContainer>
  );
};

export default Settings;
