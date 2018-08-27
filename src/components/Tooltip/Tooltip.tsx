import * as React from 'react';

import * as styles from './Tooltip.scss';

type Props = {
  children: React.ReactNode;
  text: string;
  position?: 'up' | 'left' | 'right' | 'down';
};

const Tooltip = ({ text, children, position = 'down' }: Props) => (
  <span
    className={styles.tooltip}
    data-title={text}
    data-tooltip-pos={position}
  >
    {children}
  </span>
);

export default Tooltip;
