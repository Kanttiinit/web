import * as React from 'react'
import {observer} from 'mobx-react'
import * as c from 'classnames'

import {preferenceStore} from '../../store'
const css = require('./PropertySelector.scss')

const properties = ['A', 'G', 'M', 'S', 'T', 'V', 'Veg']

export default observer(() =>
  <div className={css.container}>
    {properties.map(p =>
    <button
      onClick={() => preferenceStore.toggleProperty(p)}
      className={c('button', css.property, preferenceStore.isPropertySelected(p) && css.selected)}
      key={p}>
      {p}
    </button>
    )}
  </div>
)
