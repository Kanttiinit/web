import * as React from 'react';
import styled from 'styled-components';

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
};

const Container = styled.div`
  margin-bottom: 1rem;

  label {
    color: var(--gray1);
    display: block;
    margin-bottom: 0.4rem;
  }

  input, textarea {
    box-sizing: border-box;
    width: 100%;
    outline: none;
    padding: 0.5rem;
    font-family: inherit;
    border: none;
    background: transparent;
    color: var(--gray1);
    border: solid 1px var(--gray3);
    border-radius: 4px;

    &:focus {
      border-color: var(--accent_color);
    }
  }
`;

export default React.memo((props: Props) => {
  const fieldProps = {
    id: props.id,
    required: props.required,
    autoComplete: props.autoComplete,
    value: props.value,
    disabled: props.disabled,
    autoFocus: props.autoFocus
  };

  const onChange = React.useCallback(e => {
    if (props.onChange)
      props.onChange(e.target.value);
  }, [props.onChange]);

  return (
    <Container>
      <label htmlFor={props.id}>{props.label}</label>
      {props.multiline
        ? <textarea rows={props.rows} {...fieldProps} onChange={onChange} />
        : <input {...fieldProps} type={props.type} onChange={onChange} />
      }
    </Container>
  );
});
