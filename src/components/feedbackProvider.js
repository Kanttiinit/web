// @flow
import React from 'react'

export default (Component: any) => class extends React.PureComponent {
  state: {
    sending: boolean,
    sent: boolean,
    error: ?Error
  } = {
    sending: false,
    sent: false,
    error: null
  };

  onSubmit = async (message: string) => {
    this.setState({sending: true})
    try {
      await fetch('https://bot.kanttiinit.fi/feedback', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message
        })
      })
      this.setState({sending: false, sent: true, error: null})
    } catch (error) {
      this.setState({sending: false, error})
    }
  }

  render() {
    return (
      <Component
        onSubmitFeedback={this.onSubmit}
        feedbackState={this.state}
        {...this.props} />
    )
  }
}
