import * as React from 'react';

import { preferenceStore } from '../../store';
import { properties } from '../../utils/translations';
import * as css from './CourseList.scss';
import Tooltip from '../Tooltip';

export default ({ property }: { property: string }) => {
  const prop = properties.find(p => p.key === property);
  const propName = prop
    ? preferenceStore.lang === 'fi'
      ? prop.name_fi
      : prop.name_en
    : '';
  return (
    <Tooltip text={propName}>
      {property}
      <span
        className={css.propertyClickTrap}
        onClick={() => preferenceStore.toggleProperty(property)}
      />
    </Tooltip>
  );
};
