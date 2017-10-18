// @flow
import React from 'react'
import {observer} from 'mobx-react'

import {uiState, preferenceStore} from '../store'
import css from './Contact/Contact.scss'
import Text from './Text'
import PageContainer from './PageContainer'
import feedbackProvider from './feedbackProvider'

export default feedbackProvider(
  @observer
  class ReportModal extends React.Component {

    onSubmit = (e: any) => {
      e.preventDefault()
      const [reportField, emailField] = e.target.elements
      this.props.onSubmitFeedback(
`🤥 Incorrect data reported:

"${reportField.value}"

✉️ E-mail: ${emailField.value || 'anonymous'}
🏢 Restaurant ID: ${this.props.restaurantId}
📅 Day: ${uiState.day.format('DD/MM/YYYY')}
🗺 Language: ${preferenceStore.lang}`
      )
    }

    reportRef = (e: HTMLElement) => {
      if (e) {
        e.focus()
      }
    }

    render() {
      const {feedbackState: {sending, sent}} = this.props

      return (
        <PageContainer title={<Text id="reportDataTitle" />}>
        {sent
          ? <Text element="p" id="thanksForFeedback" />
          : <form onSubmit={this.onSubmit} className={css.container}>
              <label htmlFor="report"><Text id="reportLabel" /></label>
              <textarea ref={this.reportRef} id="report" required rows={9} />
              <label htmlFor="email"><Text id="reportEmail" /></label>
              <input type="email" id="email" />
              <button disabled={sending}>
                <Text id={sending ? 'reporting' : 'report'} />
              </button>
            </form>
        }
        </PageContainer>
      )
    }
  }
)
