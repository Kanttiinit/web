import * as React from 'react';

import * as styles from './Tooltip.scss';
import translations from '../../utils/translations';
import { preferenceStore } from '../../store';
import { observer } from 'mobx-react';

type Props = {
  children: React.ReactNode;
  text?: string;
  translationKey?: keyof (typeof translations);
  position?: 'up' | 'left' | 'right' | 'down';
};

const Tooltip = observer(
  ({ text, translationKey, children, position = 'down' }: Props) => {
    const title = text || translations[translationKey][preferenceStore.lang];
    return (
      <span
        className={styles.tooltip}
        data-title={title}
        data-tooltip-pos={position}
      >
        {children}
      </span>
    );
  }
);

export default Tooltip;
