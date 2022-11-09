import { Accessor, createMemo, createSignal } from "solid-js";

type T = string | number;

export default function useInput(
  defaultValue: T
): [
  Accessor<T>,
  Accessor<{ value: Accessor<T>; onChange(e: React.ChangeEvent<HTMLInputElement>): void }>,
  (value: T) => void
] {
  const [value, setValue] = createSignal(defaultValue);
  const inputProps = createMemo(
    () => ({
      value,
      onChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (typeof defaultValue === 'number') {
          setValue(Number(e.target.value));
        } else {
          setValue(e.target.value);
        }
      }
    })
  );
  return [value, inputProps, setValue];
}
