import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';

import { preferenceStore } from '../../store';
import Text from '../Text';
import Radio from '../Radio';
import Toggle from '../Toggle';
import PageContainer from '../PageContainer';
import FavoriteSelector from '../FavoriteSelector';
import PropertySelector from '../PropertySelector';
import { Order, Lang } from '../../store/types';

type ItemProps = {
  label: React.ReactNode;
  children: React.ReactNode;
};

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
  value: order,
  label: <Text id={order} />
}));

const languageOptions = [
  { label: 'Finnish', value: Lang.FI },
  { label: 'English', value: Lang.EN }
];

export default withRouter(
  observer(
    class Settings extends React.Component {
      props: RouteComponentProps<any>;

      setOrder = (value: Order) => {
        preferenceStore.order = value;
      };

      setUseLocation = (value: boolean) => {
        preferenceStore.useLocation = value;
      };

      setDarkMode = (value: boolean) => {
        preferenceStore.darkMode = value;
      };

      setLang(lang: Lang) {
        preferenceStore.lang = lang;
      }

      render() {
        return (
          <PageContainer title={<Text id="settings" />}>
            <Item label={<Text id="language" />}>
              <Radio
                options={languageOptions}
                selected={preferenceStore.lang}
                onChange={this.setLang}
              />
            </Item>
            <Item label={<Text id="darkMode" />}>
              <Toggle
                selected={preferenceStore.darkMode}
                onChange={this.setDarkMode}
              />
            </Item>
            <Item label={<Text id="order" />}>
              <Radio
                options={orders}
                selected={preferenceStore.order}
                onChange={this.setOrder}
              />
            </Item>
            <Item label={<Text id="useLocation" />}>
              <Toggle
                selected={preferenceStore.useLocation}
                onChange={this.setUseLocation}
              />
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
      }
    }
  )
);
