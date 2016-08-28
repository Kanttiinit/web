import React from 'react'

import PageContainer from './PageContainer'
import Text from './Text'

const Beta = () => (
  <PageContainer>
    <div className="beta">
      <a href="https://beta.kanttiinit.fi/"><button><Text id="betaSite" /></button></a>
      <a href="https://play.google.com/apps/testing/com.kanttiinit"><button><Text id="androidTester" /></button></a>
    </div>
  </PageContainer>
)

export default Beta
