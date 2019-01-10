import * as React from 'react';

import { Lang } from '../store/types';
import usePersistedState from '../utils/usePersistedState';

interface LangContext {
  lang: Lang;
  toggleLang(): void;
  setLang(state: Lang): void;
}

const langContext = React.createContext<LangContext>({} as any);

export const LangContextProvider = (props: { children: React.ReactNode }) => {
  const [lang, setLang] = usePersistedState('lang', Lang.FI);

  const toggleLang = React.useCallback(
    () => {
      setLang(lang === Lang.FI ? Lang.EN : Lang.FI);
    },
    [lang]
  );

  return (
    <langContext.Provider value={{ toggleLang, lang, setLang }}>
      {props.children}
    </langContext.Provider>
  );
};

export default langContext;
