// @flow
import React from 'react'
import {Link} from 'react-router-dom'

const privacyFi = (
  <div>
    <p>Kanttiinit ei jaa mitään dataa kolmansille osapuolille.</p>
  </div>
)

const privacyEn = (
  <div>
    <p>Kanttiinit will not share your data with third parties.</p>
  </div>
)

export default {
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
  settings: {
    fi: 'Asetukset',
    en: 'Settings'
  },
  privacyPolicyContent: {
    fi: privacyFi,
    en: privacyEn
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
  useLocation: {
    fi: 'Käytä sijaintia',
    en: 'Use location'
  },
  language: {
    fi: 'Kieli',
    en: 'Language'
  },
  selectArea: {
    fi: 'Valitse alue',
    en: 'Select area'
  },
  emptyRestaurants: {
    fi: 'Ei ravintoloita',
    en: 'No restaurants'
  },
  starred: {
    fi: 'Tähdellä merkityt',
    en: 'Starred'
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
  },
  reportDataTitle: {
    fi: 'Ilmoita virheellisestä tiedosta',
    en: 'Report incorrect data'
  },
  reportLabel: {
    fi: 'Mikä tieto on väärin?',
    en: 'What seems to be incorrect?'
  },
  reportEmail: {
    fi: 'Sähköpostiosoitteesi (valinnainen)',
    en: 'Your e-mail address (optional)'
  },
  report: {
    fi: 'Ilmoita',
    en: 'Report'
  },
  reporting: {
    fi: 'Lähetetään...',
    en: 'Reporting...'
  },
  otherClients: {
    fi: 'Muut käyttöliittymät',
    en: 'Other clients'
  },
  error: {
    fi: 'Odottomaton virhe',
    en: 'Unexpected error'
  },
  errorDetails: {
    fi: 'Tapahtui odottamaton virhe, joka on raportoitu kehjittäjille. Yritä myöhemmin uudestaan.',
    en: 'There was an unexcpected error which has been reported to the developers. Please try again later.'
  }
}
