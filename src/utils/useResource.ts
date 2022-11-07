import * as React from 'react';

export interface Resource<T> {
  data: T;
  error: Error | null;
  fulfilled: boolean;
  pending: boolean;
}

export default function useResource<T>(
  defaultData: T,
  pendingByDefault = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): [Resource<T>, ((promise: Promise<T>) => any), (pending?: boolean) => void] {
  const [state, setState] = React.useState<Resource<T>>({
    data: defaultData,
    error: null,
    fulfilled: false,
    pending: pendingByDefault
  });

  const setData = React.useCallback(
    async (promise: Promise<T>) => {
      setState({
        ...state,
        error: null,
        fulfilled: false,
        pending: true
      });
      try {
        const data = await promise;
        setState({
          ...state,
          data,
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
    },
    [state]
  );

  const markPending = React.useCallback(
    (pending = true) => {
      setState({ ...state, pending });
    },
    [state]
  );

  return [state, setData, markPending];
}
