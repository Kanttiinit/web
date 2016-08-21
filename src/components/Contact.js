import React from 'react'
import 'isomorphic-fetch'

import PageContainer from './PageContainer'

export default class Contact extends React.Component {
  constructor() {
    super()
    this.state = {sending: false, sent: false}
  }
  onSubmit(event) {
    event.preventDefault()
    this.setState({sending: true})
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
    .then(() => setState({sending: false, sent: true}))
    .catch(() => setState({sending: false, error: true}))
  }
  componentDidMount() {
    this.refs.email.focus()
  }
  render() {
    const {sending} = this.state;
    return (
      <PageContainer title="Contact">
        <form className="contact-form" onSubmit={this.onSubmit.bind(this)}>
          <input type="email" ref="email" placeholder="E-mail" required />
          <textarea placeholder="Message" rows="10" ref="message" required></textarea>
          <button disabled={sending} type="submit">{sending ? 'Lähetetään...' : 'Lähetä'}</button>
        </form>
      </PageContainer>
    )
  }
}
