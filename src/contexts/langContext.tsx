import * as React from 'react';

import usePersistedState from '../utils/usePersistedState';
import { Lang } from './types';

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

  const context = React.useMemo(
    () => ({
      lang,
      setLang,
      toggleLang
    }),
    [lang]
  );

  return (
    <langContext.Provider value={context}>
      {props.children}
    </langContext.Provider>
  );
};

export default langContext;
