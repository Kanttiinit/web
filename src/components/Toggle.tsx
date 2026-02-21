import { styled } from 'solid-styled-components';

interface Props {
  onChange: (selected: boolean) => void;
  selected: boolean;
}

const Track = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 44px;
  height: 26px;
  border-radius: 13px;
  border: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  background: var(--gray4);
  transition: background 0.2s ease;

  &[data-on] {
    background: var(--accent_color);
  }

  &:focus-visible {
    outline: 2px solid var(--accent_color);
    outline-offset: 2px;
  }
`;

const Knob = styled.span`
  position: absolute;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  pointer-events: none;
`;

const Toggle = (props: Props) => (
  <Track
    data-on={props.selected ? '' : undefined}
    onClick={() => props.onChange(!props.selected)}
    onKeyDown={(e: KeyboardEvent) =>
      e.key === 'Enter' && props.onChange(!props.selected)
    }
  >
    <Knob
      style={{
        transform: props.selected ? 'translateX(18px)' : 'translateX(0)',
      }}
    />
  </Track>
);

export default Toggle;
