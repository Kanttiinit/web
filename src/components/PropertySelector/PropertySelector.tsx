import * as React from 'react';
import { observer } from 'mobx-react';
import * as classnames from 'classnames';

import { preferenceStore } from '../../store';
import { properties } from '../../utils/translations';
import css from './PropertySelector.scss';

export default observer(({ showDesiredProperties }) => (
  <div className={css.container}>
    {properties
    .filter(p => (showDesiredProperties ? p.desired : !p.desired))
    .map(p => (
        <button
          onClick={() => preferenceStore.toggleProperty(p.key)}
          className={classnames(
            'button',
            p.desired ? css.desiredProperty : css.undesiredProperty,
            preferenceStore.isPropertySelected(p.key) && css.selected
          )}
          key={p.key}
        >
          {p[`name_${preferenceStore.lang}`]}
        </button>
      ))}
  </div>
));
