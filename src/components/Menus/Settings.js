// @flow
import React from 'react'
import Facebook from 'react-icons/lib/fa/facebook-official'
import Google from 'react-icons/lib/fa/google'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'

import {preferenceStore, dataStore} from '../../store'
import {orders} from '../../store/PreferenceStore'
import type {Order} from '../../store/PreferenceStore'
import http from '../../utils/http'
import css from '../../styles/Settings.scss'
import Text from '../Text'
import Radio from '../Radio'
import PageContainer from '../PageContainer'

const Item = ({label, children}) => (
  <div className="settings-item">
    <h2 className={css.sectionHeader}>{label}</h2>
    {children}
  </div>
)

@observer
export default class Settings extends React.PureComponent {
  setOrder = (value: Order) => {preferenceStore.order = value}
  setUseLocation = (value: boolean) => {preferenceStore.useLocation = value}
  render() {
    return (
      <PageContainer title={<Text id="settings" />}>
        <Link className={css.favorites} to="/settings/favorites">
          <Text id="favorites" className="button" element="button" />
        </Link>
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
          <Radio
            options={[
              {label: <Text id="yes" />, value: true},
              {label: <Text id="no" />, value: false}
            ]}
            selected={preferenceStore.useLocation}
            onChange={this.setUseLocation} />
        </Item>
      </PageContainer>
    )
  }
}
