import { styled } from 'solid-styled-components';

export const RoundedButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;

  &:after {
    content: '';
    flex-grow: 1000000000;
  }

  svg {
    display: block;
    padding-top: 0.1rem;
  }
`;

export const RoundedButton = styled.button<{
  color: string;
  selected: boolean;
}>`
  font-family: inherit;
  align-items: center;
  justify-content: center;
  margin: 0.2em;
  font-size: 0.8rem;
  color: ${props => props.color};
  text-align: left;
  display: flex;
  flex-grow: 1;
  background: transparent;
  border: 1px solid ${props => props.color};
  border-radius: var(--radius-full);
  transition: background 0.1s, color 0.1s;
  padding: 0.35rem 0.75rem 0.4rem;

  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 1px;
  }

  ${props =>
    props.selected
      ? `
      background: ${props.color};
      color: var(--gray6);

      &:focus {
        filter: brightness(115%);
        background: ${props.color};
      }
    `
      : ''}
`;
