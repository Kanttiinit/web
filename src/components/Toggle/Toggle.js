import React from 'react'
import css from './Toggle.scss'

type Props<T> = {
  onChange: (value: T) => void,
  selected: T,
  className?: string,
  style?: Object
}

export default class Toggle<T> extends React.PureComponent<void, Props<T>, void> {
  props: Props<T>
  render () {
    const { selected, className, onChange } = this.props
    return (
      <div className={className}>
        <span
          tabIndex={0}
          onClick={() => onChange(!selected)}
          className={
            css.toggle + (selected ? (' ' + css.toggleOn) : (' ' + css.toggleOff))
          }>
        </span>
      </div>
    )
  }
}
