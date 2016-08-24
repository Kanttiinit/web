import React from 'react'
import {connect} from 'react-redux'

const Text = ({translations, lang, id}) => {
  if (!translations[id]) {
    console.warn(`no translations for "${id}"`)
  } else if (!translations[id][lang]) {
    console.warn(`"${id}" is not translated into ${lang}`)
  }
  return <span>{translations[id][lang]}</span>
}

const mapState = state => ({
  translations: state.translations,
  lang: state.preferences.lang
})

export default connect(mapState)(Text)
