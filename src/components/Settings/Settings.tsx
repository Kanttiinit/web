import * as React from 'react';
import styled from 'styled-components';

import { langContext, preferenceContext } from '../../contexts';
import { Lang, Order } from '../../contexts/types';
import FavoriteSelector from '../FavoriteSelector';
import PageContainer from '../PageContainer';
import PropertySelector from '../PropertySelector';
import Radio from '../Radio';
import Text from '../Text';
import Toggle from '../Toggle';

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
  <React.Fragment>
    <ItemTitle>{label}</ItemTitle>
    {children}
  </React.Fragment>
);

const orders = [Order.AUTOMATIC, Order.ALPHABET, Order.DISTANCE].map(order => ({
  label: <Text id={order} />,
  value: order
}));

const languageOptions = [
  { label: 'Finnish', value: Lang.FI },
  { label: 'English', value: Lang.EN }
];

const Settings = () => {
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
    (darkMode: boolean) => preferences.setDarkMode(darkMode),
    []
  );

  const setLang = React.useCallback(
    (lang: Lang) => langState.setLang(lang),
    []
  );

  return (
    <PageContainer title={<Text id="settings" />}>
      <Item label={<Text id="language" />}>
        <Radio
          options={languageOptions}
          selected={langState.lang}
          onChange={setLang}
        />
      </Item>
      <Item label={<Text id="darkMode" />}>
        <Toggle selected={preferences.darkMode} onChange={setDarkMode} />
      </Item>
      <Item label={<Text id="order" />}>
        <Radio
          options={orders}
          selected={preferences.order}
          onChange={setOrder}
        />
      </Item>
      <Item label={<Text id="useLocation" />}>
        <Toggle selected={preferences.useLocation} onChange={setUseLocation} />
      </Item>
      <Item label={<Text id="highlightDiets" />}>
        <PropertySelector showDesiredProperties />
      </Item>
      <Item label={<Text id="avoidDiets" />}>
        <PropertySelector />
      </Item>
      <Item label={<Text id="prioritize" />}>
        <FavoriteSelector />
      </Item>
    </PageContainer>
  );
};

export default Settings;
