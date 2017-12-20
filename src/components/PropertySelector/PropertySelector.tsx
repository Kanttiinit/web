import * as React from 'react'
import {observer} from 'mobx-react'
import * as classnames from 'classnames'

import {preferenceStore} from '../../store'
import {properties} from '../../utils/translations'
const css = require('./PropertySelector.scss')

export default observer(() =>
  <div className={css.container}>
    {properties.map(p =>
      <button
        onClick={() => preferenceStore.toggleProperty(p.key)}
        className={classnames(
          'button',
          p.desired ? css.desiredProperty : css.undesiredProperty,
          preferenceStore.isPropertySelected(p.key) && css.selected
        )}
        key={p.key}>
        {p[`name_${preferenceStore.lang}`]}
      </button>
    )}
  </div>
)
