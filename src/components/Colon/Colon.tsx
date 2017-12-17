import * as React from 'react'

const css = require('./Colon.scss')

export default class Colon extends React.PureComponent {
  props: {
    children: string
  }

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
