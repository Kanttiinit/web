import { createEffect, createSignal } from "solid-js";
import { computedState } from "../../state";
import { useFeedback } from "../../utils";
import Button from "../Button";
import Input from "../Input";
import type { FormProps } from "./ReportModal";

export default (props: FormProps) => {
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [feedback, send] = useFeedback();

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    send(
      `Feedback regarding restaurant "${
        props.restaurant.name
      }":\n"${message()}"`,
      email() as string,
    );
  };

  createEffect(() => {
    if (feedback.sent) {
      props.setDone(true);
    }
  });

  createEffect(() => {
    if (feedback.error) props.setError(feedback.error);
  });

  return (
    <form onSubmit={onSubmit}>
      <Input
        label={computedState.translations().email}
        type="email"
        id="email"
        value={email()}
        onChange={setEmail}
      />
      <Input
        label={computedState.translations().message}
        required
        multiline
        id="message"
        rows={10}
        value={message()}
        onChange={setMessage}
      />
      <Button disabled={feedback.sending} type="submit">
        {feedback.sending
          ? computedState.translations().sending
          : computedState.translations().send}
      </Button>
      &nbsp;
      <Button onClick={props.goBack} secondary>
        {computedState.translations().back}
      </Button>
    </form>
  );
};
