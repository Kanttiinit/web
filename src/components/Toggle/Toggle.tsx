import * as React from 'react';
import css from './Toggle.scss';

type Props = {
  onChange: (value: boolean) => void;
  selected: boolean;
  className?: string;
  style?: Object;
};

const Toggle = ({ selected, className, onChange }: Props) => {
  return (
    <div className={className}>
      <span
        tabIndex={0}
        onClick={() => onChange(!selected)}
        className={
          css.toggle + (selected ? ' ' + css.toggleOn : ' ' + css.toggleOff)
        }
      />
    </div>
  );
};

export default Toggle;
