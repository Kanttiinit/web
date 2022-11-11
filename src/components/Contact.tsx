import { computedState, state } from '../state';
import { useFeedback } from '../hooks';
import Button from './Button';
import Input from './Input';
import PageContainer from './PageContainer';

const Contact = () => {
  const [feedback, send] = useFeedback();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const [email, message] = e.target.elements;
    send(message.value, email.value);
  };

  return (
    <PageContainer title={computedState.translations().contact}>
      {feedback.sent ? (
        computedState.translations().thanksForFeedback
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
          <Button
            disabled={feedback.sending}
            type="submit"
          >
            {feedback.sending ? computedState.translations().sending : computedState.translations().send}
          </Button>
        </form>
      )}
    </PageContainer>
  );
};

export default Contact;
