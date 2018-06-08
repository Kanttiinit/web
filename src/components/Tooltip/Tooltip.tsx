import * as React from 'react';
import 'balloon-css/balloon.css';

type Props = {
  children: React.ReactNode;
  text: string;
  position?: 'up' | 'left' | 'right' | 'down';
  size?: 'fit' | 'small' | 'medium' | 'large' | 'xlarge';
};

const Tooltip = ({
  text,
  children,
  position = 'down',
  size = 'fit'
}: Props) => (
  <span
    data-balloon-blunt
    data-balloon={text}
    data-balloon-pos={position}
    data-balloon-length={size}
  >
    {children}
  </span>
);

export default Tooltip;
