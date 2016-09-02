import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as actions from '../store/actions/preferences'
import PageContainer from './PageContainer'
import Text from './Text'
import Radio from './Radio'
import AreaSelector from './Menus/AreaSelector'

const Item = ({label, children}) => (
  <div className="settings-item">
    <h2>{label}</h2>
    {children}
  </div>
)

const Settings = ({preferences, setUseLocation, setLang}) => (
  <PageContainer title={<Text id="settings" />} className="settings">
    <Item label={<Text id="area" />}>
      <AreaSelector />
    </Item>
    <Item label={<Text id="useLocation" />}>
      <Radio
        options={[
          {label: <Text id="yes" />, value: true},
          {label: <Text id="no" />, value: false}
        ]}
        selected={preferences.useLocation}
        onChange={value => setUseLocation(value)} />
    </Item>
    <Item label={<Text id="language" />}>
      <Radio
        options={[
          {label: 'Finnish', value: 'fi'},
          {label: 'English', value: 'en'}
        ]}
        selected={preferences.lang}
        onChange={lang => setLang(lang)} />
    </Item>
  </PageContainer>
)

const mapState = state => ({
  preferences: state.preferences
})

const mapDispatch = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapState, mapDispatch)(Settings)
