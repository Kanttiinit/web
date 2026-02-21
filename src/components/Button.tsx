import { styled } from 'solid-styled-components';

interface ButtonProps {
  small?: boolean;
  secondary?: boolean;
  color?: string;
}

const Button = styled.button<ButtonProps>`
  border: none;
  padding: 0.8em 1.2em;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.8rem;
  display: inline-block;
  min-width: 4rem;
  background: ${props =>
    props.color === 'secondary' || props.secondary
      ? 'var(--text-muted)'
      : 'var(--accent_color)'};
  text-align: center;
  color: white;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: transform 0.1s, box-shadow 0.1s;
  opacity: 0.95;

  &:hover {
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: none;
  }

  &:focus {
    color: white;
    outline: 2px solid var(--accent_color);
    outline-offset: 2px;
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
