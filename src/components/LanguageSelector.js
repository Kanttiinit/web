import React from 'react'
import {connect} from 'react-redux'

import {selectLang} from '../store/selectors'
import {setLang} from '../store/actions/preferences'

const LanguageSelector = ({lang, setLang}) => (
  <div className="language-selector">
    <button onClick={() => setLang('fi')}>Finnish</button>
    <button onClick={() => setLang('en')}>English</button>
  </div>
)

// <select style={{fontSize: '2rem', marginTop: '1rem'}} value={lang} onChange={e => setLang(e.target.value)}>
//   <option value="fi">Finnish</option>
//   <option value="en">English</option>
// </select>

const mapState = state => ({
  lang: selectLang(state)
})

const mapDispatch = dispatch => ({
  setLang: lang => dispatch(setLang(lang))
})

export default connect(mapState, mapDispatch)(LanguageSelector)
