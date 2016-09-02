import React from 'react'

const Radio = ({options, selected, onChange, className = '', style}) => (
  <div className={'radio ' + className} style={style}>
    {options.map(({label, value}) =>
    <button
      key={value}
      onClick={() => value !== selected && onChange(value)}
      className={selected === value ? 'selected' : ''}>
      {label}
    </button>
    )}
  </div>
)

export default Radio
