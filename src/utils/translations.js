// @flow
import React from 'react'
import {Link} from 'react-router-dom'

const privacyFi = (
  <div>
    <p>Jos kirjaudut sisään käyttäen Facebook tai Google tiliäsi, Kanttiinit tallentaa nimesi ja sähköpostiosoitteesi.</p>
    <p>Kanttiinit ei jaa mitään dataa kolmansille osapuolille.</p>
  </div>
)

const privacyEn = (
  <div>
    <p>If you log in using your Facebook or Google account, Kanttiinit will save your name and e-mail address.</p>
    <p>Kanttiinit will not share your data with third parties.</p>
  </div>
)

export default {
  menus: {
    fi: 'Ruokalistat',
    en: 'Menus'
  },
  noMenu: {
    fi: 'Ei ruokalistaa saatavilla',
    en: 'No menu available'
  },
  restaurantClosed: {
    fi: 'suljettu',
    en: 'closed'
  },
  privacyPolicy: {
    fi: 'Yksityisyyskäytäntö',
    en: 'Privacy Policy'
  },
  contact: {
    fi: 'Ota yhteyttä',
    en: 'Contact'
  },
  sourceCode: {
    fi: 'Lähdekoodi',
    en: 'Source Code'
  },
  settings: {
    fi: 'Asetukset',
    en: 'Settings'
  },
  privacyPolicyContent: {
    fi: privacyFi,
    en: privacyEn
  },
  slogan: {
    fi: 'Opiskelijalounas vaivattomasti.',
    en: 'Student lunch effortlessly.'
  },
  thanksForFeedback: {
    fi: 'Kiitos palautteestasi!',
    en: 'Thank you for your feedback!'
  },
  email: {
    fi: 'Sähköposti',
    en: 'E-mail'
  },
  message: {
    fi: 'Viesti',
    en: 'Message'
  },
  send: {
    fi: 'Lähetä',
    en: 'Send'
  },
  sending: {
    fi: 'Lähetetään...',
    en: 'Sending...'
  },
  closed: {
    fi: 'suljettu',
    en: 'closed'
  },
  androidTester: {
    fi: 'Ryhdy Android-sovelluksen betatestaajaksi',
    en: 'Become a tester on Android'
  },
  betaSite: {
    fi: 'Kokeile sivun betaversiota',
    en: 'Try the beta site'
  },
  area: {
    fi: 'Alue',
    en: 'Area'
  },
  useLocation: {
    fi: 'Käytä sijaintia',
    en: 'Use location'
  },
  language: {
    fi: 'Kieli',
    en: 'Language'
  },
  yes: {
    fi: 'Kyllä',
    en: 'Yes'
  },
  no: {
    fi: 'Ei',
    en: 'No'
  },
  selectArea: {
    fi: 'Valitse alue',
    en: 'Select area'
  },
  profile: {
    fi: 'Profiili',
    en: 'Profile'
  },
  logout: {
    fi: 'Kirjaudu ulos',
    en: 'Log out'
  },
  facebookLogin: {
    fi: 'Kirjaudu sisään Facebookilla',
    en: 'Facebook login'
  },
  googleLogin: {
    fi: 'Kirjaudu sisään Googlella',
    en: 'Google login'
  },
  save: {
    fi: 'Tallenna',
    en: 'Save'
  },
  saving: {
    fi: 'Tallennetaan...',
    en: 'Saving...'
  },
  emptyRestaurants: {
    fi: 'Ei ravintoloita',
    en: 'No restaurants'
  },
  addStar: {
    fi: 'Nosta',
    en: 'Pin'
  },
  removeStar: {
    fi: 'Poista nosto',
    en: 'Unpin'
  },
  moreInfo: {
    fi: 'Lisätietoja',
    en: 'Details'
  },
  starred: {
    fi: 'Nostetut',
    en: 'Pinned'
  },
  nearby: {
    fi: 'Lähellä',
    en: 'Nearby'
  },
  meters: {
    fi: 'metriä',
    en: 'meters'
  },
  kilometers: {
    fi: 'kilometriä',
    en: 'kilometers'
  },
  closeModal: {
    fi: 'paina sulkeaksesi',
    en: 'press here to close'
  },
  favorites: {
    fi: 'Suosikit',
    en: 'Favorites'
  },
  order: {
    fi: 'Järjestys',
    en: 'Order'
  },
  homepage: {
    fi: 'Kotisivu',
    en: 'Homepage'
  },
  ORDER_AUTOMATIC: {
    fi: 'Automaattinen',
    en: 'Automatic'
  },
  ORDER_ALPHABET: {
    fi: 'Aakkos',
    en: 'Alphabet'
  },
  ORDER_DISTANCE: {
    fi: 'Etäisyys',
    en: 'Distance'
  },
  locating: {
    fi: 'Haetaan sijaintia...',
    en: 'Locating...'
  },
  turnOnLocation: {
    fi: <span>Laita sijainti päälle <Link to="/settings">asetuksista.</Link></span>,
    en: <span>Turn on location <Link to="/settings">in the settings.</Link></span>
  }
}
