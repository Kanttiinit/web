import * as React from 'react';
import styled from 'solid-styled-components';

import { langContext, preferenceContext } from '../../contexts';
import { DarkModeChoice, Lang, Order } from '../../contexts/types';
import { useTranslations } from '../../utils/hooks';
import FavoriteSelector from '../FavoriteSelector';
import PageContainer from '../PageContainer';
import Radio from '../Radio';
import Toggle from '../Toggle';
import PriceCategorySelector from './PriceCategorySelector';
import PropertySelector from './PropertySelector';

interface ItemProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

const ItemTitle = styled.h2`
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--gray3);
  margin-top: 2em;
`;

const Item = ({ label, children }: ItemProps) => (
  <>
    <ItemTitle>{label}</ItemTitle>
    {children}
  </>
);

const orders = [Order.AUTOMATIC, Order.ALPHABET, Order.DISTANCE];

const languageOptions = [
  { label: 'Finnish', value: Lang.FI },
  { label: 'English', value: Lang.EN }
];

const Settings = () => {
  const translations = useTranslations();
  const preferences = React.useContext(preferenceContext);
  const langState = React.useContext(langContext);

  const setOrder = React.useCallback(
    (order: Order) => preferences.setOrder(order),
    []
  );

  const setUseLocation = React.useCallback(
    (location: boolean) => preferences.setUseLocation(location),
    []
  );

  const setDarkMode = React.useCallback(
    (darkMode: DarkModeChoice) => preferences.setDarkMode(darkMode),
    []
  );

  const setLang = React.useCallback(
    (lang: Lang) => langState.setLang(lang),
    []
  );

  return (
    <PageContainer title={translations.settings}>
      <Item label={translations.language}>
        <Radio
          options={languageOptions}
          selected={langState.lang}
          onChange={setLang}
        />
      </Item>
      <Item label={translations.priceCategory}>
        <PriceCategorySelector
          value={preferences.maxPriceCategory}
          onChange={preferences.setMaxPriceCategory}
        />
      </Item>
      <Item label={translations.theme}>
        <Radio
          options={[
            { label: translations.default, value: DarkModeChoice.DEFAULT },
            { label: translations.light, value: DarkModeChoice.OFF },
            { label: translations.dark, value: DarkModeChoice.ON }
          ]}
          selected={preferences.selectedDarkMode}
          onChange={setDarkMode}
        />
      </Item>
      <Item label={translations.order}>
        <Radio
          options={orders.map(order => ({
            label: translations[order],
            value: order
          }))}
          selected={preferences.order}
          onChange={setOrder}
        />
      </Item>
      <Item label={translations.useLocation}>
        <Toggle selected={preferences.useLocation} onChange={setUseLocation} />
      </Item>
      <Item label={translations.highlightDiets}>
        <PropertySelector showDesiredProperties />
      </Item>
      <Item label={translations.avoidDiets}>
        <PropertySelector />
      </Item>
      <Item label={translations.prioritize}>
        <FavoriteSelector />
      </Item>
    </PageContainer>
  );
};

export default Settings;
