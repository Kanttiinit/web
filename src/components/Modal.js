// @flow
import React from 'react'
import key from 'keymaster'
import {observer} from 'mobx-react'
import classnames from 'classnames'
import {withRouter} from 'react-router-dom'

import Text from './Text'
import css from '../styles/Modal.scss'

@observer
class Modal extends React.PureComponent {
  componentDidMount() {
    key('esc', this.closeModal)
  }
  closeModal = () => this.props.history.goBack()
  render() {
    return (
      <div className={classnames(css.container,  css.open)}>
        <div className={css.overlay} onClick={this.closeModal}></div>
        <div className={css.content}>
        {this.props.children}
        </div>
        <div className={css.closeText} onClick={this.closeModal}>
          <Text id="closeModal" />
        </div>
      </div>
    )
  }
}

export default withRouter(Modal)
