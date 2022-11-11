import { styled } from 'solid-styled-components';

interface ButtonProps {
  small?: boolean;
}

const Button = styled.button<ButtonProps>`
  border: none;
  padding: 0.8em 1.2em;
  border-radius: 0.2em;
  font-family: inherit;
  display: inline-block;
  text-transform: uppercase;
  min-width: 4rem;
  background: var(--accent_color);
  text-align: center;
  color: var(--gray6);
  outline: none;
  font-weight: 500;

  ${props =>
    props.small ?
    `
      font-size: 0.7rem;
      padding: 0.5em 0.7em;
    ` : ''}
`;

export const TextButton = styled(Button)`
  background: transparent;
  padding: 0;
  font-size: 0.8rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
