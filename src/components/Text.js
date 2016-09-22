import React from 'react'
import {connect} from 'react-redux'

import 'moment/locale/fi'
import 'moment/locale/en-gb'

const Text = ({translations, lang, id, moment}) => {
  if (!moment) {
    if (!translations[id]) {
      console.warn(`no translations for "${id}"`)
    } else if (!translations[id][lang]) {
      console.warn(`"${id}" is not translated into ${lang}`)
    }
  }
  return <span>{moment ? moment.locale(lang).format(id) : translations[id][lang]}</span>
}

const mapState = state => ({
  translations: state.translations,
  lang: state.preferences.lang
})

export default connect(mapState)(Text)
