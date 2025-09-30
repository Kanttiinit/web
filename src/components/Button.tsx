import { styled } from 'solid-styled-components';

interface ButtonProps {
  small?: boolean;
  secondary?: boolean;
  color?: string;
}

const Button = styled.button<ButtonProps>`
  border: none;
  padding: 0.8em 1.2em;
  border-radius: 0.4em;
  font-family: inherit;
  font-size: 0.8rem;
  display: inline-block;
  text-transform: uppercase;
  min-width: 4rem;
  background: ${props =>
    props.secondary ? 'var(--gray3)' : 'var(--accent_color)'};
  text-align: center;
  color: var(--gray6);
  outline: none;
  font-weight: 500;
  transition: transform 0.1s;
  opacity: 0.95;

  &:hover {
    opacity: 1;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    color: var(--gray6);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props =>
    props.small
      ? `
      font-size: 0.7rem;
      padding: 0.5em 0.7em;
    `
      : ''}
`;

export const TextButton = styled(Button)`
  background: transparent;
  padding: 0;
  color: inherit;
`;

export default Button;
