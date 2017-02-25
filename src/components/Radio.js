// @flow
import React from 'react'

import css from '../styles/Radio.scss'

export default class Radio<T> extends React.PureComponent {
  props: {
    options: Array<{
      label: any,
      value: T
    }>,
    selected: T,
    onChange: (value: T) => void,
    className?: string,
    style?: Object
  }
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
