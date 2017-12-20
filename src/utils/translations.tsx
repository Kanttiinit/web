import * as React from 'react'
import {Link} from 'react-router-dom'

import {Order} from '../store/types'

export const properties = [
  {key: 'A*', desired: false, name_en: 'contains allergens', name_fi: 'sisältää allergeeneja'},
  {key: 'C*', desired: false, name_en: 'contains celery', name_fi: 'sisältää selleriä'},
  {key: 'E', desired: true, name_en: 'egg-free', name_fi: 'ei sisällä kananmunaa'},
  {key: 'G', desired: true, name_en: 'gluten-free', name_fi: 'gluteeniton'},
  {key: 'H', desired: true, name_en: 'healthier choice', name_fi: 'terveellisempi valinta'},
  {key: 'L', desired: true, name_en: 'lactose-free', name_fi: 'laktoositon'},
  {key: 'LL', desired: true, name_en: 'low in lactose', name_fi: 'vähälaktoosinen'},
  {key: 'M', desired: true, name_en: 'milk-free', name_fi: 'ei sisällä maitoa'},
  {key: 'N*', desired: false, name_en: 'contains nuts', name_fi: 'sisältää pähkinää'},
  {key: 'O*', desired: false, name_en: 'contains garlic', name_fi: 'sisältää valkosipulia'},
  {key: 'S', desired: true, name_en: 'soy-free', name_fi: 'ei sisällä soijaa'},
  {key: 'S*', desired: false, name_en: 'contains soy', name_fi: 'sisältää soijaa'},
  {key: 'V', desired: true, name_en: 'vegetarian', name_fi: 'vegetaarinen'},
  {key: 'VV', desired: true, name_en: 'vegan', name_fi: 'vegaani'}
]

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
    fi: (
      <div>
        <p>Kanttiinit ei jaa mitään dataa kolmansille osapuolille.</p>
      </div>
    ),
    en: (
      <div>
        <p>Kanttiinit will not share your data with third parties.</p>
      </div>
    )
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
  [Order.AUTOMATIC]: {
    fi: 'Automaattinen',
    en: 'Automatic'
  },
  [Order.ALPHABET]: {
    fi: 'Aakkos',
    en: 'Alphabet'
  },
  [Order.DISTANCE]: {
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
  },
  updates: {
    fi: 'Päivitykset',
    en: 'Updates'
  },
  specialDiets: {
    fi: 'Erityisruokavaliot',
    en: 'Special diets'
  }
}
