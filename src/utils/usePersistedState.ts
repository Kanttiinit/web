import { createEffect, createSignal } from "solid-js";

export default function usePersistedState<T>(
  key: string,
  defaultState: T
) {
  const [value, setValue] = createSignal<T>(defaultState);
  createEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(key)!);
      setValue(v || defaultState);
    } catch (e) {
      setValue(defaultState as any);
    }
  }, []);

  return {
    value,
    setValue: (v: T) => {
      localStorage.setItem(key, JSON.stringify(v));
      setValue(v as any);
    }
  };
}
