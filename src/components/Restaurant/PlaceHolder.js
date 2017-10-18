import React from 'react'
import times from 'lodash/times'
import random from 'lodash/random'

import css from './Restaurant.scss'

export default class Placeholder extends React.Component {
  shouldComponentUpdate() {
    return false
  }
  render() {
    return (
      <div className={css.container + ' ' + css.placeholder}>
        <div className={css.header} style={{width: random(30, 40) + '%'}}></div>
        <div className={css.body}>
          {times(10, i => <div key={i} className={css.course} style={{width: random(40, 100) + '%'}}></div>)}
        </div>
      </div>
    )
  }
}