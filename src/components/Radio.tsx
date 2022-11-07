import { For, splitProps } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakLarge, breakSmall } from '../globalStyles';

interface Props<T> {
  options: {
    label: any;
    value: T;
  }[];
  selected: string;
  onChange: (value: T) => void;
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

export const Button = styled.button<{ selected: boolean }>`
  color: var(--accent_color);
  background: transparent;
  font-family: inherit;
  font-weight: 500;
  text-transform: uppercase;
  transition: background 0.1s, color 0.1s;
  margin: 0;
  border-radius: 1rem;
  outline: none;
  border: solid 2px transparent;

  @media (max-width: ${breakSmall}) {
    font-size: 0.7rem;
    padding: 0.5rem 0.4rem;
  }

  @media (min-width: ${breakLarge}) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }

  &:focus {
    border-color: var(--gray4);
  }

  ${props =>
    props.selected ?
    `
    background: var(--accent_color);
    color: var(--gray6);

    &:focus {
      filter: brightness(115%);
      color: var(--gray6);
    }
  ` : ''}
`;

export default function Radio<T>(props: Props<T>) {
  const [ownProps, rest] = splitProps(props, ['onChange', 'options', 'selected'])
  return (
    <Container {...rest}>
      <For each={props.options}>
        {({ label, value }) => (
          <Button
            onClick={() => value !== props.selected && props.onChange(value)}
            selected={props.selected === value}
          >
            {label}
          </Button>
        )}
      </For>
    </Container>
  );
};
