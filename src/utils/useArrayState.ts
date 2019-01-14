import { useMemo } from 'react';

interface ArrayActions<T> {
  push(item: T): void;
  removeByIndex(index: number): void;
  set(array: T[]): void;
  setItemInArray(item: T, shouldItemExistInArray: boolean): void;
  toggle(item: T, shouldItemExistInArray?: boolean): void;
}

export default <T>([array, setArray]: [T[], (array: T[]) => void]) => {
  const push = (item: T) => {
    setArray([...array, item]);
  };

  const removeByIndex = (index: number) => {
    const a = [...array];
    a.splice(index, 1);
    setArray(a);
  };

  const toggle = (item: T) => {
    const index = array.indexOf(item);
    if (index > -1) {
      removeByIndex(index);
    } else {
      push(item);
    }
  };

  const setItemInArray = (item: T, shouldItemExistInArray: boolean) => {
    const index = array.indexOf(item);
    if (shouldItemExistInArray && index === -1) {
      push(item);
    } else if (!shouldItemExistInArray && index > -1) {
      removeByIndex(index);
    }
  };

  return useMemo<[T[], ArrayActions<T>]>(
    () => [
      array,
      {
        push,
        removeByIndex,
        set: setArray,
        setItemInArray,
        toggle
      }
    ],
    [array]
  );
};
