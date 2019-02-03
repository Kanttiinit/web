import * as React from 'react';

import { sendFeedback } from './api';

interface State {
  sending: boolean;
  sent: boolean;
  error: Error | null;
}

export interface FeedbackProps extends State {
  send?: (message: string) => Promise<void>;
}

export default (): FeedbackProps => {
  const [state, setState] = React.useState<State>({
    error: null,
    sending: false,
    sent: false
  });

  return React.useMemo(
    () => ({
      ...state,
      send: async (message: string) => {
        setState({ ...state, sending: true });
        try {
          await sendFeedback(message);
          setState({ ...state, sending: false, sent: true, error: null });
        } catch (error) {
          setState({ ...state, sending: false, error });
        }
      }
    }),
    [state]
  );
};
