// @flow
import React from 'react'

import {sendFeedback} from '../utils/api'

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
      await sendFeedback(message)
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
