// @flow
import React from 'react'
import {withRouter} from 'react-router-dom'
import {observer} from 'mobx-react'

import {preferenceStore} from '../../store'
import {orders} from '../../store/PreferenceStore'
import type {Order} from '../../store/PreferenceStore'
import css from './Settings.scss'
import Text from '../Text'
import Radio from '../Radio'
import Toggle from '../Toggle'
import PageContainer from '../PageContainer'
import FavoriteSelector from '../FavoriteSelector'
import PropertySelector from '../PropertySelector'

const Item = ({label, children}) => (
  <div className="settings-item">
    <h2 className={css.sectionHeader}>{label}</h2>
    {children}
  </div>
)

@observer
export default withRouter(class Settings extends React.Component {
  setOrder = (value: Order) => {preferenceStore.order = value}
  setUseLocation = (value: boolean) => {preferenceStore.useLocation = value}
  render() {
    return (
      <PageContainer title={<Text id="settings" />}>
        <Item label={<Text id="language" />}>
          <Radio
            options={[
              {label: 'Finnish', value: 'fi'},
              {label: 'English', value: 'en'}
            ]}
            selected={preferenceStore.lang}
            onChange={lang => {preferenceStore.lang = lang}} />
        </Item>
        <Item label={<Text id="order" />}>
          <Radio
            options={orders.map(order => ({
              value: order,
              label: <Text id={order} />
            }))}
            selected={preferenceStore.order}
            onChange={this.setOrder} />
        </Item>
        <Item label={<Text id="useLocation" />}>
          <Toggle
            selected={preferenceStore.useLocation}
            onChange={this.setUseLocation}
            />
        </Item>
        <Item label="Erityisruokavaliot">
          <PropertySelector />
        </Item>
        <Item label={<Text id="favorites" />}>
          <FavoriteSelector />
        </Item>
      </PageContainer>
    )
  }
})
