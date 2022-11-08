import { state } from '../state';
import useFeedback from '../utils/useFeedback';
import Button from './Button';
import Input from './Input';
import PageContainer from './PageContainer';

const Contact = () => {
  const { sending, sent, send } = useFeedback();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const [email, message] = e.target.elements;
    send(message.value, email.value);
  };

  return (
    <PageContainer title={state.translations.contact}>
      {sent ? (
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
            disabled={sending}
            type="submit"
          >
            {sending ? state.translations.sending : state.translations.send}
          </Button>
        </form>
      )}
    </PageContainer>
  );
};

export default Contact;
