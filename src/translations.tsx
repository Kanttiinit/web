import Link from './components/Link';
import { Order, PriceCategory } from './types';

interface FormattedProperty {
  key: string;
  desired: boolean;
  name_en: string;
  name_fi: string;
}

export const properties: FormattedProperty[] = [
  {
    desired: false,
    key: 'A+',
    name_en: 'contains allergens',
    name_fi: 'sisältää allergeeneja',
  },
  {
    desired: false,
    key: 'C+',
    name_en: 'contains celery',
    name_fi: 'sisältää selleriä',
  },
  {
    desired: true,
    key: 'E',
    name_en: 'egg-free',
    name_fi: 'ei sisällä kananmunaa',
  },
  { key: 'G', desired: true, name_en: 'gluten-free', name_fi: 'gluteeniton' },
  {
    desired: true,
    key: 'H',
    name_en: 'healthier choice',
    name_fi: 'terveellisempi valinta',
  },
  { key: 'L', desired: true, name_en: 'lactose-free', name_fi: 'laktoositon' },
  {
    desired: true,
    key: 'LL',
    name_en: 'low in lactose',
    name_fi: 'vähälaktoosinen',
  },
  {
    desired: true,
    key: 'M',
    name_en: 'milk-free',
    name_fi: 'ei sisällä maitoa',
  },
  {
    desired: false,
    key: 'N+',
    name_en: 'contains nuts',
    name_fi: 'sisältää pähkinää',
  },
  {
    desired: false,
    key: 'O+',
    name_en: 'contains garlic',
    name_fi: 'sisältää valkosipulia',
  },
  {
    desired: true,
    key: 'S',
    name_en: 'soy-free',
    name_fi: 'ei sisällä soijaa',
  },
  {
    desired: false,
    key: 'S+',
    name_en: 'contains soy',
    name_fi: 'sisältää soijaa',
  },
  { key: 'V', desired: true, name_en: 'vegetarian', name_fi: 'vegetaarinen' },
  { key: 'VV', desired: true, name_en: 'vegan', name_fi: 'vegaani' },
];

export const priceCategorySettings = {
  [PriceCategory.student]: {
    fi: 'Näytetään vain ravintolat, jotka tarjoavat opiskelijahintaisen lounaan.',
    en: 'Only showing restaurants that provide student-priced lunches.',
  },
  [PriceCategory.studentPremium]: {
    fi: 'Näytetään ravintolat, jotka tarjoavat mitä tahansa opiskelija-alennuksia.',
    en: 'Showing restaurants that provide any student discounts.',
  },
  [PriceCategory.regular]: {
    fi: 'Näytetään kaikki ravintolat.',
    en: 'Showing all restaurants.',
  },
};

const translations = {
  noMenu: {
    en: 'No menu available.',
    fi: 'Ruokalistaa ei ole saatavilla.',
  },
  restaurantClosed: {
    en: 'closed',
    fi: 'suljettu',
  },
  termsOfService: {
    en: 'Terms Of Service',
    fi: 'Käyttöehdot',
  },
  contact: {
    en: 'Contact',
    fi: 'Ota yhteyttä',
  },
  settings: {
    en: 'Settings',
    fi: 'Asetukset',
  },
  termsOfServiceContent: {
    en: (
      <div>
        <p>
          Kanttiinit retrieves all menu data directly from the restaurants, and
          isn&#39;t directly responsible for the correctness of any information.
          Please verify the information about allergens at the restaurants.
        </p>
        <p>Kanttiinit does not collect any identifiable user data.</p>
      </div>
    ),
    fi: (
      <div>
        <p>
          Kanttiinit hakee kaikki ruokalistat suoraan ravintoloiden sivuilta,
          eikä ole itse vastuussa tietojen paikkansapitävyydestä. Muista
          varmistaa ruokien allergeenit paikan päällä ravintolassa.
        </p>
        <p>Kanttiinit ei kerää mitään yksilöitävää käyttäjän dataa.</p>
      </div>
    ),
  },
  thanksForFeedback: {
    fi: 'Kiitos palautteestasi!',
    en: 'Thank you for your feedback!',
  },
  email: {
    fi: 'Sähköposti',
    en: 'E-mail',
  },
  message: {
    fi: 'Viesti',
    en: 'Message',
  },
  send: {
    fi: 'Lähetä',
    en: 'Send',
  },
  sending: {
    fi: 'Lähetetään...',
    en: 'Sending...',
  },
  closed: {
    fi: 'suljettu',
    en: 'closed',
  },
  useLocation: {
    fi: 'Käytä sijaintia',
    en: 'Use location',
  },
  language: {
    fi: 'Kieli',
    en: 'Language',
  },
  selectArea: {
    fi: 'Valitse alue',
    en: 'Select area',
  },
  emptyRestaurants: {
    fi: 'Ei ravintoloita.',
    en: 'No restaurants.',
  },
  starred: {
    fi: 'Tähdellä merkityt',
    en: 'Starred',
  },
  nearby: {
    fi: 'Lähellä',
    en: 'Nearby',
  },
  meters: {
    fi: 'metriä',
    en: 'meters',
  },
  kilometers: {
    fi: 'kilometriä',
    en: 'kilometers',
  },
  closeModal: {
    fi: 'Sulje',
    en: 'Close',
  },
  favorites: {
    fi: 'Suosikit',
    en: 'Favorites',
  },
  order: {
    fi: 'Järjestys',
    en: 'Order',
  },
  homepage: {
    fi: 'Kotisivu',
    en: 'Homepage',
  },
  [Order.AUTOMATIC]: {
    fi: 'Automaattinen',
    en: 'Automatic',
  },
  [Order.ALPHABET]: {
    fi: 'Aakkos',
    en: 'Alphabet',
  },
  [Order.DISTANCE]: {
    fi: 'Etäisyys',
    en: 'Distance',
  },
  locating: {
    fi: 'Sijaintia haetaan...',
    en: 'Locating...',
  },
  turnOnLocation: {
    fi: () => (
      <span>
        Laita sijainti päälle <Link to="/settings">asetuksista.</Link>
      </span>
    ),
    en: () => (
      <span>
        Turn on location <Link to="/settings">in the settings.</Link>
      </span>
    ),
  },
  reportDataTitle: {
    fi: 'Mikä tieto on väärin?',
    en: 'Which information is incorrect?',
  },
  reportLabel: {
    fi: 'Mikä tieto on väärin?',
    en: 'What seems to be incorrect?',
  },
  reportEmail: {
    fi: 'Sähköpostiosoitteesi (valinnainen)',
    en: 'Your e-mail address (optional)',
  },
  report: {
    fi: 'Lähetä',
    en: 'Report',
  },
  reporting: {
    fi: 'Lähetetään...',
    en: 'Reporting...',
  },
  otherClients: {
    fi: 'Muut käyttöliittymät',
    en: 'Other clients',
  },
  error: {
    fi: 'Odottomaton virhe',
    en: 'Unexpected error',
  },
  errorDetails: {
    fi: 'Tapahtui odottamaton virhe, joka on raportoitu kehjittäjille. Yritä myöhemmin uudestaan.',
    en: 'There was an unexcpected error which has been reported to the developers. Please try again later.',
  },
  updates: {
    fi: 'Uutiset',
    en: 'News',
  },
  avoidDiets: {
    fi: 'Himmennä',
    en: 'Dim',
  },
  highlightDiets: {
    fi: 'Korosta',
    en: 'Highlight',
  },
  prioritize: {
    fi: 'Priorisoi',
    en: 'prioritize',
  },
  offline: {
    fi: 'Ei verkkoyhteyttä.',
    en: 'You are currently offline.',
  },
  theme: {
    fi: 'Teema',
    en: 'Theme',
  },
  copyURLToClipboard: {
    fi: 'Kopioi linkki leikepöydälle',
    en: 'Copy link to clipboard',
  },
  copyMenuToClipboard: {
    fi: 'Kopioi ruokalista leikepöydälle',
    en: 'Copy menu to clipboard',
  },
  shareURL: {
    fi: 'Jaa linkki',
    en: 'Share link',
  },
  restaurantNotFound: {
    fi: 'Ravintolaa ei löytynyt.',
    en: 'Restaurant not found.',
  },
  assetsLoading: {
    fi: 'Ladataan...',
    en: 'Loading...',
  },
  openingHours: {
    fi: 'Aukioloajat',
    en: 'Opening hours',
  },
  somethingElse: {
    fi: 'Muu tieto',
    en: 'Something else',
  },
  back: {
    fi: 'Takaisin',
    en: 'Back',
  },
  copyFromPreviousDay: {
    fi: 'Kopioi edelliseltä päivältä',
    en: 'Copy from previous day',
  },
  fixRestaurantInformation: {
    fi: 'Ehdota tietojen korjausta ravintolalle %restaurantName%',
    en: 'Suggest a fix for %restaurantName%',
  },
  location: {
    fi: 'Sijainti',
    en: 'Location',
  },
  openingTime: {
    fi: 'aukeamisaika',
    en: 'opening time',
  },
  closingTime: {
    fi: 'sulkemisaika',
    en: 'closing time',
  },
  address: {
    fi: 'Osoite',
    en: 'Address',
  },
  default: {
    fi: 'Oletus',
    en: 'Default',
  },
  light: {
    fi: 'Vaalea',
    en: 'Light',
  },
  dark: {
    fi: 'Tumma',
    en: 'Dark',
  },
  tosShort: {
    fi: 'Huom. Kanttiinit tarjoaa ruokalistat muokkaamattomana, ota yhteyttä itse ravintolaan jos palautteesi koskee ruokaa tai sen sisältöä',
    en: 'Note: Kanttiinit displays the restaurant menus unedited, please contact the restaurant itself if your feedback concerns the food or its contents',
  },
  priceCategory: {
    fi: 'Hintaluokka',
    en: 'Price Category',
  },
  highlightOperator: {
    fi: 'Korosta ruokalajit jotka sisältävät',
    en: 'Highlight courses that contain',
  },
  and: {
    fi: 'Kaikki valinnat',
    en: 'All of the selected',
  },
  or: {
    fi: 'Mitkä tahansa valinnoista',
    en: 'Any of the selected',
  },
  [PriceCategory.student]: {
    fi: 'Opiskelijalounas',
    en: 'Student lunch',
  },
  [PriceCategory.studentPremium]: {
    fi: 'Joitain alennuksia opiskelijoille',
    en: 'Some discounts for students',
  },
  [PriceCategory.regular]: {
    fi: 'Ei opiskelija-alennuksia',
    en: 'No student discounts',
  },
};

export default translations;
