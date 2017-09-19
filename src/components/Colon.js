import React from 'react'

import css from '../styles/Colon.scss'

export default class Colon extends React.PureComponent {
  render() {
    const {children} = this.props
    const parts = children.split(':')
    return (
      <span className={css.container}>
        {parts.map((part, i) => <span key={i}>{part}</span>)}
      </span>
    )
  }
}