// @flow
import React from 'react'

import PageContainer from './PageContainer'
import Text from './Text'

export default class Clients extends React.PureComponent {
  render() {
    return (
      <PageContainer title={<Text id="otherClients" />}>
        <h3>
          <a href="https://folio.kanttiinit.fi/">Kanttiinit Folio</a>
        </h3>
        <p>JavaScript-less version of Kanttiinit for people with tin foil hats.</p>
        <h3>
          <a href="https://telegram.me/KanttiinitBOT" target="_blank">Kanttiinit Telegram</a>
        </h3>
        <p>Chat bot for Telegram.</p>
        <h3>
          <a href="https://github.com/Kanttiinit/cli" target="_blank">Kanttiinit CLI</a>
        </h3>
        <p>Command line interface built with Node.</p>
        <h3>
          <a href="https://play.google.com/apps/testing/com.kanttiinit" target="_blank">Kanttiinit Android</a>
        </h3>
        <p>Android App, but not actively maintained anymore.</p>
      </PageContainer>
    )
  }   
}