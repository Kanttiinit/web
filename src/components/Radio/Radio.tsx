import * as React from 'react';

const css = require('./Radio.scss');

type Props = {
  options: Array<{
    label: any;
    value: string;
  }>;
  selected: string;
  onChange: (value: string) => void;
  className?: string;
  style?: Object;
};

const Radio = ({
  options,
  selected,
  onChange,
  className = '',
  style
}: Props) => {
  return (
    <div className={css.container + ' ' + className} style={style}>
      {options.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => value !== selected && onChange(value)}
          className={selected === value ? css.selected : ''}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Radio;
