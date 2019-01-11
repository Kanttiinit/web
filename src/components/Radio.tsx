import * as React from 'react';
import styled from 'styled-components';

interface Props {
  options: Array<{
    label: any;
    value: string;
  }>;
  selected: string;
  onChange: (value: string) => void;
  className?: string;
  style?: any;
}

const Container = styled.div`
  white-space: nowrap;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Button = styled.button<{ selected: boolean }>`
  color: var(--accent_color);
  background: transparent;
  font-family: inherit;
  font-weight: 500;
  text-transform: uppercase;
  transition: background 0.1s, color 0.1s;
  margin: 0;
  border-radius: 1rem;
  outline: none;
  border: none;

  @media (max-width: ${props => props.theme.breakSmall}) {
    font-size: 0.7rem;
    padding: 0.5rem 0.4rem;
  }

  @media (min-width: ${props => props.theme.breakLarge}) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }

  &:focus {
    background: var(--gray3);
  }

  ${props =>
    props.selected &&
    `
    background: var(--accent_color);
    color: var(--gray6);

    &:focus {
      filter: brightness(115%);
      color: var(--gray6);
    }
  `}
`;

const Radio = ({ options, selected, onChange, ...rest }: Props) => {
  return (
    <Container {...rest}>
      {options.map(({ label, value }) => (
        <Button
          key={value}
          onClick={() => value !== selected && onChange(value)}
          selected={selected === value}
        >
          {label}
        </Button>
      ))}
    </Container>
  );
};

export default Radio;
