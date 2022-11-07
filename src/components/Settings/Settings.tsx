import { JSXElement } from 'solid-js';
import { styled } from 'solid-styled-components';

import { DarkModeChoice, Lang, Order } from '../../contexts/types';
import { setState, state } from '../../state';
import FavoriteSelector from '../FavoriteSelector';
import PageContainer from '../PageContainer';
import Radio from '../Radio';
import Toggle from '../Toggle';
// import PriceCategorySelector from './PriceCategorySelector';
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
    <PageContainer title={state.translations.settings}>
      <Item label={state.translations.language}>
        <Radio
          options={languageOptions}
          selected={state.lang}
          onChange={value => setState('lang', value)}
        />
      </Item>
      <Item label={state.translations.priceCategory}>
        {/* <PriceCategorySelector
          value={state.preferences.maxPriceCategory}
          onChange={value => setState('preferences', 'maxPriceCategory', value)}
        /> */}
      </Item>
      <Item label={state.translations.theme}>
        <Radio
          options={[
            { label: state.translations.default, value: DarkModeChoice.DEFAULT },
            { label: state.translations.light, value: DarkModeChoice.OFF },
            { label: state.translations.dark, value: DarkModeChoice.ON }
          ]}
          selected={state.preferences.darkMode}
          onChange={value => setState('preferences', 'darkMode', value)}
        />
      </Item>
      <Item label={state.translations.order}>
        <Radio
          options={orders.map(order => ({
            label: state.translations[order],
            value: order
          }))}
          selected={state.preferences.order}
          onChange={value => setState('preferences', 'order', value)}
        />
      </Item>
      <Item label={state.translations.useLocation}>
        <Toggle
          selected={state.preferences.useLocation}
          onChange={value => setState('preferences', 'useLocation', value)}
        />
      </Item>
      <Item label={state.translations.highlightDiets}>
        <PropertySelector showDesiredProperties />
      </Item>
      <Item label={state.translations.avoidDiets}>
        <PropertySelector />
      </Item>
      <Item label={state.translations.prioritize}>
        <FavoriteSelector />
      </Item>
    </PageContainer>
  );
};

export default Settings;
