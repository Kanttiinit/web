import { For, splitProps } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props<T> {
  options: {
    label: any;
    value: T;
  }[];
  selected: string;
  onChange: (value: T) => void;
  class?: string;
  style?: any;
}

const Container = styled.div`
  display: inline-flex;
  background: var(--radio-track);
  border-radius: var(--radius-full);
  padding: 3px;
  gap: 0;
  overflow-x: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Button = styled.button<{ selected: boolean }>`
  color: ${props => (props.selected ? 'var(--text-primary)' : 'var(--text-muted)')};
  background: ${props => (props.selected ? 'var(--radio-selected)' : 'transparent')};
  box-shadow: ${props => (props.selected ? 'var(--shadow-sm)' : 'none')};
  border: ${props => (props.selected ? '1px solid var(--border-subtle)' : '1px solid transparent')};
  font-family: inherit;
  font-weight: 500;
  font-size: 0.8rem;
  padding: 0.45rem 1rem;
  border-radius: var(--radius-full);
  border: none;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  margin: 0;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

export default function Radio<T>(props: Props<T>) {
  const [_ownProps, rest] = splitProps(props, [
    'onChange',
    'options',
    'selected',
  ]);
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
}
