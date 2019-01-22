import { useMemo, useState } from 'react';

type T = string | number;

export default function useInput(
  defaultValue: T
): [
  T,
  { value: T; onChange(e: React.ChangeEvent<HTMLInputElement>): void },
  (value: T) => void
] {
  const [value, setValue] = useState(defaultValue);
  const inputProps = useMemo(
    () => ({
      value,
      onChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (typeof defaultValue === 'number') {
          setValue(Number(e.target.value));
        } else {
          setValue(e.target.value);
        }
      }
    }),
    [value]
  );
  return [value, inputProps, setValue];
}
