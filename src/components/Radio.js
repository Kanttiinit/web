import React from 'react'

import css from '../styles/Radio.scss'

const Radio = ({options, selected, onChange, className = '', style}) => (
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
