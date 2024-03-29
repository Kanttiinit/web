import { createEffect } from 'solid-js';
import { styled } from 'solid-styled-components';

type Props = {
  label: string;
  multiline?: boolean;
  onChange?: (value: string) => void;
  value?: any;
  required?: boolean;
  id?: string;
  autoComplete?: string;
  type?: string;
  disabled?: boolean;
  rows?: number;
  autoFocus?: boolean;
  pattern?: string;
  class?: string;
  style?: any;
  step?: any;
};

const Container = styled.div`
  margin-bottom: 1rem;

  label {
    color: var(--gray1);
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.9rem;
  }

  input,
  textarea {
    box-sizing: border-box;
    width: 100%;
    outline: none;
    padding: 0.5rem;
    font-family: inherit;
    border: none;
    background: transparent;
    color: var(--gray1);
    border: solid 1px var(--gray4);
    border-radius: 4px;

    &:disabled {
      color: var(--gray5);
      border-color: var(--gray5);
    }

    &:focus {
      border-color: var(--accent_color);
    }
  }
`;

export default function Input(props: Props) {
  const fieldProps = () => ({
    id: props.id,
    required: props.required,
    autoComplete: props.autoComplete,
    value: props.value,
    disabled: props.disabled,
    autoFocus: props.autoFocus,
    pattern: props.pattern,
    step: props.step
  });

  const onChange = (e: any) => {
    if (props.onChange) props.onChange(e?.target?.value);
  };

  return (
    <Container class={props.class} style={props.style}>
      <label for={props.id}>{props.label}</label>
      {props.multiline ? (
        <textarea rows={props.rows} {...fieldProps()} onChange={onChange} />
      ) : (
        <input {...fieldProps()} type={props.type} onChange={onChange} />
      )}
    </Container>
  );
}
