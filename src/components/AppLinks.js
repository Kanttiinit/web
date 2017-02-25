// @flow
import React from 'react'
import {OutboundLink as Link} from 'react-ga'

import iosImg from '../assets/ios_store.svg'
import androidImg from '../assets/google_play.png'
import telegramImg from '../assets/telegram.svg'
import css from '../styles/AppLinks.scss'

type Props = {
  style: Object
}

export const AppLinks = ({style}: Props) => (
  <div className={css.appLinks} style={style}>
    <Link eventLabel="Telegram Bot" to="https://telegram.me/KanttiinitBOT">
      <img src={telegramImg} />
    </Link>
    <Link eventLabel="Android Store" to={window.isBeta ? 'https://play.google.com/apps/testing/com.kanttiinit' : 'https://play.google.com/store/apps/details?id=com.kanttiinit'}>
      <img alt="Get it on Google Play" src={androidImg} />
    </Link>
    <Link eventLabel="iOS Store" to="https://itunes.apple.com/fi/app/kanttiinit/id1069903670?l=fi&mt=8">
     <img src={iosImg} />
    </Link>
  </div>
)

export default AppLinks
