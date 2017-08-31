// @flow
import React from 'react'

import PageContainer from './PageContainer'
import Text from './Text'

export default class Clients extends React.PureComponent {
  render() {
    return (
      <PageContainer title={<Text id="otherClients" />}>
        <ul>
          <li>
            <a href="https://telegram.me/KanttiinitBOT" target="_blank">Telegram Chat Bot</a>
          </li>
          <li>
            <a href="https://github.com/Kanttiinit/cli" target="_blank">Command Line Interface</a>
          </li>
          <li>
            <a href="https://play.google.com/apps/testing/com.kanttiinit" target="_blank">Android App (not actively maintained)</a>
          </li>
        </ul>
      </PageContainer>
    )
  }   
}