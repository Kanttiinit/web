import { useMemo, useState } from 'react';

export default function useInput(
  defaultValue: string
): [
  string,
  { value: string; onChange(e: React.ChangeEvent<HTMLInputElement>): void },
  (value: string) => void
] {
  const [value, setValue] = useState(defaultValue);
  const inputProps = useMemo(
    () => ({
      value,
      onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
      }
    }),
    [value]
  );
  return [value, inputProps, setValue];
}
