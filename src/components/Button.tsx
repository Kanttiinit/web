import { styled, css } from 'solid-styled-components';

interface ButtonProps {
  variant?: 'text';
  size?: 'small';
}

const Button = styled.button<ButtonProps>`
  border: none;
  background: transparent;
  padding: 0;
  font-family: inherit;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 500;

  ${props =>
    props.variant !== 'text' ?
    css`
      padding: 0.8em 1.2em;
      border-radius: 0.2em;
      display: inline-block;
      min-width: 4rem;
      background: var(--accent_color);
      text-align: center;
      color: var(--gray6);
      outline: none;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    ` : ''}

  ${props =>
    props.size === 'small' ?
    css`
      font-size: 0.7rem;
      padding: 0.5em 0.7em;
    ` : ''}
`;

export default Button;
