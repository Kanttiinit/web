import * as React from 'react';

import { useTranslations } from '../../utils/hooks';
import useFeedback from '../../utils/useFeedback';
import PageContainer from '../PageContainer';
import Button from '../Button';
import Input from '../Input';

const Contact = () => {
  const translations = useTranslations();
  const { sending, sent, send } = useFeedback();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const [email, message] = e.target.elements;
    send(message.value, email.value);
  };

  return (
    <PageContainer title={translations.contact}>
      {sent ? (
        translations.thanksForFeedback
      ) : (
        <form onSubmit={onSubmit}>
          <Input
            autoFocus
            type="email"
            id="email"
            required
            label={translations.email}
            autoComplete="off"
          />
          <Input
            multiline
            id="message"
            required
            label={translations.message}
            rows={10}
          />
          <Button
            disabled={sending}
            type="submit"
          >
            {sending ? translations.sending : translations.send}
          </Button>
        </form>
      )}
    </PageContainer>
  );
};

export default Contact;
