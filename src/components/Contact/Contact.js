// @flow
import React from 'react'

import css from './Contact.scss'
import PageContainer from '../PageContainer'
import Text from '../Text'
import feedbackProvider from '../feedbackProvider'

export default feedbackProvider(class Contact extends React.PureComponent {
  onSubmit = (e: Event) => {
    e.preventDefault()
    this.props.onSubmitFeedback(`Email: ${this.refs.email.value}\n"${this.refs.message.value}"`)
  }

  componentDidMount() {
    this.refs.email.focus()
  }

  render() {
    const {sending, sent} = this.props.feedbackState
    return (
      <PageContainer title={<Text id="contact" />}>
        {sent
          ? <Text element="p" id="thanksForFeedback" />
          : <form className={css.container} onSubmit={this.onSubmit}>
              <label htmlFor="email"><Text id="email" /></label>
              <input type="email" id="email" ref="email" required />
              <label htmlFor="message"><Text id="message" /></label>
              <textarea rows="10" id="message" ref="message" required></textarea>
              <button disabled={sending} type="submit">{sending ? <Text id="sending" /> : <Text id="send" />}</button>
            </form>
        }
      </PageContainer>
    )
  }
})