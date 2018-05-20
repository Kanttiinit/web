import * as React from 'react';

import css from './Contact.scss';
import PageContainer from '../PageContainer';
import Text from '../Text';
import feedbackProvider, { FeedbackProps } from '../feedbackProvider';

export default feedbackProvider(
  class Contact extends React.PureComponent<FeedbackProps> {
    email = React.createRef<HTMLInputElement>();
    message = React.createRef<HTMLTextAreaElement>();

    onSubmit = (e: React.FormEvent<any>) => {
      e.preventDefault();
      this.props.onSubmitFeedback(
        `Email: ${this.email.current.value}\n"${this.message.current.value}"`
      );
    };

    componentDidMount() {
      this.email.current.focus();
    }

    render() {
      const { sending, sent } = this.props.feedbackState;
      return (
        <PageContainer title={<Text id="contact" />}>
          {sent ? (
            <Text element="p" id="thanksForFeedback" />
          ) : (
            <form className={css.container} onSubmit={this.onSubmit}>
              <label htmlFor="email">
                <Text id="email" />
              </label>
              <input type="email" id="email" ref={this.email} required />
              <label htmlFor="message">
                <Text id="message" />
              </label>
              <textarea rows={10} id="message" ref={this.message} required />
              <button disabled={sending} type="submit">
                {sending ? <Text id="sending" /> : <Text id="send" />}
              </button>
            </form>
          )}
        </PageContainer>
      );
    }
  }
);
