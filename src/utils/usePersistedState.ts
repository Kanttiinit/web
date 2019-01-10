import { useCallback, useEffect, useState } from 'react';

export default function usePersistedState<T>(
  key: string,
  defaultState: T = null
): [T, (state: T) => void] {
  const [value, setValue] = useState(defaultState);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      setValue(v || defaultState);
    } catch (e) {
      setValue(defaultState);
    }
  }, []);

  const setAndStoreValue = useCallback((v: T) => {
    localStorage.setItem(key, JSON.stringify(v));
    setValue(v);
  }, []);

  return [value, setAndStoreValue];
}
