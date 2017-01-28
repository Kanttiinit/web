// @flow
import React from 'react'
import 'isomorphic-fetch'

import css from '../styles/Contact.scss'
import PageContainer from './PageContainer'
import Text from './Text'

export default class Contact extends React.PureComponent {
  state: {
    sending: boolean,
    sent: boolean,
    error: boolean
  } = {
    sending: false,
    sent: false,
    error: false
  };
  onSubmit = async (event: Event) => {
    event.preventDefault()
    this.setState({sending: true})
    try {
      await fetch('https://bot.kanttiinit.fi/feedback', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Email: ${this.refs.email.value}\n"${this.refs.message.value}"`
        })
      })
      this.setState({sending: false, sent: true})
      this.refs.email.value = ''
      this.refs.message.value = ''
    } catch (e) {
      this.setState({sending: false, error: true})
    }
  }
  componentDidMount() {
    this.refs.email.focus()
  }
  render() {
    const {sending, sent} = this.state
    return (
      <PageContainer title={<Text id="contact" />}>
        {sent && <p><Text id="thanksForFeedback" /></p>}
        <form className={css.container} onSubmit={this.onSubmit}>
          <label htmlFor="email"><Text id="email" /></label>
          <input type="email" id="email" ref="email" required />
          <label htmlFor="message"><Text id="message" /></label>
          <textarea rows="10" id="message" ref="message" required></textarea>
          <button disabled={sending} type="submit">{sending ? <Text id="sending" /> : <Text id="send" />}</button>
        </form>
      </PageContainer>
    )
  }
}
