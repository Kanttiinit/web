import * as React from 'react'

const css = require('./Radio.scss')

export default class Radio extends React.PureComponent {
  props: {
    options: Array<{
      label: any,
      value: string
    }>,
    selected: string,
    onChange: (value: string) => void,
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
