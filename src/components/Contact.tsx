import { createSignal } from 'solid-js';
import { computedState } from '../state';
import { useFeedback } from '../utils';
import Button from './Button';
import Input from './Input';
import PageContainer from './PageContainer';

const Contact = () => {
  const [feedback, send] = useFeedback();
  const [acknowledged, setAcknowledged] = createSignal(false);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const [email, message] = e.target.elements;
    send(message.value, email.value);
  };

  return (
    <PageContainer title={computedState.translations().contact}>
      {feedback.sent ? (
        computedState.translations().thanksForFeedback
      ) : !acknowledged() ? (
        <>
          <p style={{ 'line-height': '1.6', color: 'var(--gray2)' }}>
            {computedState.translations().tosShort}
          </p>
          <Button onClick={() => setAcknowledged(true)}>
            {computedState.translations().continueButton}
          </Button>
        </>
      ) : (
        <form onSubmit={onSubmit}>
          <Input
            autoFocus
            type="email"
            id="email"
            required
            label={computedState.translations().email}
            autoComplete="off"
          />
          <Input
            multiline
            id="message"
            required
            label={computedState.translations().message}
            rows={10}
          />
          <Button disabled={feedback.sending} type="submit">
            {feedback.sending
              ? computedState.translations().sending
              : computedState.translations().send}
          </Button>
        </form>
      )}
    </PageContainer>
  );
};

export default Contact;
