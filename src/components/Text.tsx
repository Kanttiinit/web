import * as format from 'date-fns/format';
import * as enLocale from 'date-fns/locale/en';
import * as fiLocale from 'date-fns/locale/fi';
import * as React from 'react';

import preferenceContext from '../contexts/preferencesContext';
import translations from '../utils/translations';

const locales = {
  en: enLocale,
  fi: fiLocale
};

interface Props {
  id: string;
  date?: Date;
  element?: string;
  children?: any;
  className?: any;
}

export default (props: Props) => {
  const { id, date, element = 'span', children, ...rest } = props;
  const { lang } = React.useContext(preferenceContext);
  if (!date) {
    if (!translations[id]) {
      console.warn(`no translations for "${id}"`);
    } else if (!translations[id][lang]) {
      console.warn(`"${id}" is not translated into ${lang}`);
    }
  }
  return React.createElement(element, rest, [
    children,
    date ? format(date, id, { locale: locales[lang] }) : translations[id][lang]
  ]);
};
