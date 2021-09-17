import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLProps<HTMLInputElement>{
  label: string;
  multiline?: boolean;
}

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
    border: solid 2px var(--gray3);

    &:focus {
      border-color: var(--accent_color);
    }
  }
`;

export default React.memo((props: Props) => {
  const fieldProps = {
    id: props.id,
    required: props.required,
    autoComplete: props.autoComplete
  };
  return (
    <Container>
      <label htmlFor={props.id}>{props.label}</label>
      {props.multiline
        ? <textarea rows={10} {...fieldProps} />
        : <input {...fieldProps} type={props.type} />
      }
    </Container>
  );
});
