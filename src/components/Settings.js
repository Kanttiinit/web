import React from 'react'
import {connect} from 'react-redux'

import PageContainer from './PageContainer'

const Settings = ({preferences}) => (
  <PageContainer title="Settings">
    <p>hello world</p>
  </PageContainer>
)

const mapState = state => ({
  preferences: state.preferences
})

export default connect(mapState)(Settings)
