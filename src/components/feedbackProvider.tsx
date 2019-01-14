import * as React from 'react';

import { ComponentType } from 'react';
import { sendFeedback } from '../utils/api';

interface State {
  sending: boolean;
  sent: boolean;
  error: Error | null;
}

export interface FeedbackProps {
  onSubmitFeedback?: (message: string) => Promise<void>;
  feedbackState?: State;
}

export default (Component: ComponentType<FeedbackProps>) => (
  props: FeedbackProps
) => {
  const [state, setState] = React.useState<State>({
    error: null,
    sending: false,
    sent: false
  });

  const onSubmit = async (message: string) => {
    setState({ ...state, sending: true });
    try {
      await sendFeedback(message);
      setState({ ...state, sending: false, sent: true, error: null });
    } catch (error) {
      setState({ ...state, sending: false, error });
    }
  };

  return (
    <Component onSubmitFeedback={onSubmit} feedbackState={state} {...props} />
  );
};
