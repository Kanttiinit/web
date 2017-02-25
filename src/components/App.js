// @flow
import React from 'react'

import css from '../styles/App.scss'
import Footer from './Footer'
import Modal from './Modal'

export default class App extends React.PureComponent {
  render() {
    const {children, location} = this.props
    return (
      <div>
        <div className={css.container}>
          {children}
          <Footer path={location.pathname} />
        </div>
        <Modal />
      </div>
    )
  }
}