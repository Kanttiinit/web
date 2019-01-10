import * as React from 'react';

export interface Resource<T> {
  data: T;
  error: Error | null;
  fulfilled: boolean;
  pending: boolean;
}

export default function useResource<T>(
  defaultData: T
): [Resource<T>, ((promise: Promise<T>) => any)] {
  const [state, setState] = React.useState<Resource<T>>({
    data: defaultData,
    error: null,
    fulfilled: false,
    pending: false
  });

  const setData = React.useCallback(async (promise: Promise<T>) => {
    setState({
      ...state,
      error: null,
      fulfilled: false,
      pending: true
    });
    try {
      setState({
        ...state,
        data: await promise,
        fulfilled: true,
        pending: false
      });
    } catch (e) {
      setState({
        ...state,
        data: defaultData,
        error: e.message,
        pending: false
      });
    }
  }, []);

  return [state, setData];
}
