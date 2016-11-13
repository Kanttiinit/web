import React from 'react'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

import css from '../styles/Modal.scss'

class Modal extends React.Component {
  render() {
    const {modal} = this.props
    return (
      <div className={css.container + (modal.open ? ' ' + css.open : '')}>
        <div className={css.overlay} onClick={() => browserHistory.push('/')}></div>
        <div className={css.content}>{modal.component}</div>
      </div>
    )
  }
}

const mapState = state => ({
  modal: state.value.modal,
})

export default connect(mapState)(Modal)
