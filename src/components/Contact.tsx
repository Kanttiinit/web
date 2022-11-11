import { state } from '../state';
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
    <PageContainer title={state.translations.contact}>
      {feedback.sent ? (
        state.translations.thanksForFeedback
      ) : (
        <form onSubmit={onSubmit}>
          <Input
            autoFocus
            type="email"
            id="email"
            required
            label={state.translations.email}
            autoComplete="off"
          />
          <Input
            multiline
            id="message"
            required
            label={state.translations.message}
            rows={10}
          />
          <Button
            disabled={feedback.sending}
            type="submit"
          >
            {feedback.sending ? state.translations.sending : state.translations.send}
          </Button>
        </form>
      )}
    </PageContainer>
  );
};

export default Contact;
