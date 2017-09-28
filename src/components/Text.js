// @flow
import React from 'react'
import {observer} from 'mobx-react'
import 'moment/locale/fi'
import 'moment/locale/en-gb'

import {preferenceStore} from '../store'
import translations from '../utils/translations'

export default observer(props => {
  const {id, moment, element = 'span', children, ...rest} = props
  const {lang} = preferenceStore
  if (!moment) {
    if (!translations[id]) {
      console.warn(`no translations for "${id}"`)
    } else if (!translations[id][lang]) {
      console.warn(`"${id}" is not translated into ${lang}`)
    }
  }
  return React.createElement(element, rest, [children, moment ? moment.locale(lang).format(id) : translations[id][lang]])
})
