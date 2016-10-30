import React from 'react'
import {OutboundLink as Link} from 'react-ga'
import {Link as InboundLink} from 'react-router'

import iosImg from '../assets/ios_store.svg'
import playstoreImg from '../assets/playstore.png'
import telegramImg from '../assets/telegram.svg'
import logo from '../assets/logo.png'
import css from '../styles/Header.scss'
import Text from './Text'

export const AppLinks = ({style}) => (
  <div className={css.appLinks} style={style}>
    <Link eventLabel="Telegram Bot" to="https://telegram.me/KanttiinitBOT">
      <img src={telegramImg} />
    </Link>
    <Link eventLabel="Android Store" to="https://play.google.com/store/apps/details?id=com.kanttiinit">
      <img alt="Get it on Google Play" src="{playstoreImg}" />
    </Link>
    <Link eventLabel="iOS Store" to="https://itunes.apple.com/fi/app/kanttiinit/id1069903670?l=fi&mt=8">
     <img src={iosImg} />
    </Link>
  </div>
)

const Header = () => (
  <header className={css.container}>
    <InboundLink to="/" className={css.logo}>
      <img src={logo} />
      <div>
        <h1>Kanttiinit{window.isBeta && <sup>BETA</sup>}</h1>
        <p><Text id="slogan" /></p>
      </div>
    </InboundLink>
    <AppLinks />
  </header>
)

export default Header
