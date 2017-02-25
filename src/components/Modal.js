// @flow
import React from 'react'
import {browserHistory} from 'react-router'
import key from 'keymaster'
import {inject, observer} from 'mobx-react'

import Text from './Text'
import css from '../styles/Modal.scss'

export default class Modal extends React.PureComponent {
  componentDidMount() {
    key('esc', this.closeModal)
  }
  closeModal = () => browserHistory.replace('/')
  render() {
    const {modal} = this.props
    return (
      <div className={css.container + (modal.open ? ' ' + css.open : '')}>
        <div className={css.overlay} onClick={this.closeModal}></div>
        <div className={css.content}>{modal.component}</div>
        <div className={css.closeText} onClick={this.closeModal}><Text id="closeModal" /></div>
      </div>
    )
  }
}