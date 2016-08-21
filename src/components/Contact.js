import React from 'react'
import 'isomorphic-fetch'

import PageContainer from './PageContainer'

export default class Contact extends React.Component {
  onSubmit(event) {
    event.preventDefault()
    fetch('https://bot.kanttiinit.fi/feedback', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Email: ${this.refs.email.value}\n"${this.refs.message.value}"`
      })
    })
  }
  render() {
    return (
      <PageContainer title="Contact">
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="email" ref="email" placeholder="E-mail" required />
          <textarea placeholder="Message" rows="4" ref="message" required></textarea>
          <button type="submit">Lähetä</button>
        </form>
      </PageContainer>
    )
  }
}
