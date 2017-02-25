// @flow
import React from 'react'
import {browserHistory} from 'react-router'
import key from 'keymaster'
import {observer} from 'mobx-react'

import {uiState} from '../store'
import Text from './Text'
import css from '../styles/Modal.scss'

@observer
export default class Modal extends React.PureComponent {
  componentDidMount() {
    key('esc', this.closeModal)
  }
  closeModal = () => browserHistory.replace('/')
  render() {
    return (
      <div className={css.container + (uiState.modalOpened ? ' ' + css.open : '')}>
        <div className={css.overlay} onClick={this.closeModal}></div>
        <div className={css.content}>{uiState.modalElement}</div>
        <div className={css.closeText} onClick={this.closeModal}><Text id="closeModal" /></div>
      </div>
    )
  }
}