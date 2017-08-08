// @flow
import React from 'react'

import css from '../styles/Radio.scss'

type Props<T> = {
  options: Array<{
    label: any,
    value: T
  }>,
  selected: T,
  onChange: (value: T) => void,
  className?: string,
  style?: Object
}

export default class Radio<T> extends React.PureComponent<void, Props<T>, void> {
  props: Props<T>
  render() {
    const {options, selected, onChange, className = '', style} = this.props
    return (
      <div className={css.container + ' ' + className} style={style}>
        {options.map(({label, value}) =>
        <button
          key={value}
          onClick={() => value !== selected && onChange(value)}
          className={selected === value ? css.selected : ''}>
          {label}
        </button>
        )}
      </div>
    )
  }
}
