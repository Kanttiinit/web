import React from 'react'
import {connect} from 'react-redux'

import {selectLang} from '../store/selectors'
import {setLang} from '../store/actions/preferences'
import {IoIosWorldOutline} from 'react-icons/lib/io'

const LanguageSelector = ({lang, setLang}) => (
  <div className="language-selector">
    <IoIosWorldOutline size={18} style={{marginRight: '0.5rem'}}/>
    <button className={lang === 'fi' ? 'selected' : ''} onClick={() => setLang('fi')}>Finnish</button>
    <button className={lang === 'en' ? 'selected' : ''} onClick={() => setLang('en')}>English</button>
  </div>
)

const mapState = state => ({
  lang: selectLang(state)
})

const mapDispatch = dispatch => ({
  setLang: lang => dispatch(setLang(lang))
})

export default connect(mapState, mapDispatch)(LanguageSelector)
