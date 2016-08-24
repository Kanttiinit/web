import React from 'react'
import iosImg from '../assets/ios_store.svg'
import telegramImg from '../assets/telegram.svg'
import logo from '../assets/logo.png'

import Text from './Text'

export const AppLinks = ({style}) => (
  <div className="app-links" style={style}>
    <a href="https://telegram.me/KanttiinitBOT">
      <img src={telegramImg} />
    </a>
    <a href="https://play.google.com/store/apps/details?id=com.kanttiinit&utm_source=global_co&utm_medium=prtnr&utm_content=Mar2515&utm_campaign=PartBadge&pcampaignid=MKT-AC-global-none-all-co-pr-py-PartBadges-Oct1515-1">
      <img alt="Get it on Google Play" src="https://play.google.com/intl/en_us/badges/images/apps/en-play-badge.png" />
    </a>
    <a href="https://itunes.apple.com/fi/app/kanttiinit/id1069903670?l=fi&mt=8">
     <img src={iosImg} />
    </a>
  </div>
)

const Header = () => (
  <header className="header">
    <div className="logo">
      <img src={logo} />
      <div>
        <h1>Kanttiinit</h1>
        <p><Text id="slogan" /></p>
      </div>
    </div>
    <AppLinks />
  </header>
)

export default Header
