import * as React from 'react';

import { preferenceStore } from '../../store';
import { properties } from '../../utils/translations';
import * as css from './CourseList.scss';
import Tooltip from '../Tooltip';

export default ({ property }) => {
  const prop = properties.find(p => p.key === property);
  const propName = prop ? prop['name_' + preferenceStore.lang] : '';
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
