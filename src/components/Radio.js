// @flow
import React from 'react'

import css from '../styles/Radio.scss'

type Props<T> = {
  options: Array<{
    label: string,
    value: T
  }>,
  selected: T,
  onChange: (value: T) => void,
  className?: string,
  style?: Object
};

const Radio = ({options, selected, onChange, className = '', style}: Props<*>) => (
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

export default Radio
