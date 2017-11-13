import React from 'react'
import c from 'classnames'

import css from './PropertySelector.scss'

const properties = ['A', 'G', 'M', 'S', 'T', 'V', 'Veg']

export default class PropertySelector extends React.Component {
  render() {
    return (
      <div className={css.container}>
        {properties.map(p =>
        <button className={c('button', css.property)} key={p}>{p}</button>
        )}
      </div>
    )
  }
}
