import { styled } from "solid-styled-components";

interface Props {
  onChange: (selected: boolean) => void;
  selected: boolean;
}

const StyledToggle = styled.span<{ switchedOn: boolean }>`
  position: relative;
  display: inline-block;
  border: 2px solid var(--gray3);
  background: var(--gray3);
  border-radius: 20px;
  padding: 10px 0;
  min-width: 4em;
  min-height: 1em;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  outline: none;

  &:focus {
    background: var(--gray1);
  }

  &:after {
    cursor: pointer;
    position: absolute;
    background: var(--gray6);
    box-sizing: border-box;
    top: 50%;
    border-radius: 30px;
    margin: 0.1em;
    margin-top: -25%;
    width: 2em;
    height: 2em;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    content: '';
    ${(props) => (props.switchedOn ? "margin-left: 1.9em;" : "")}
  }

  ${(props) =>
    props.switchedOn
      ? `
      background: var(--accent_color);
      border-color: var(--accent_color);

      &:focus {
        background: var(--accent_color);
        filter: brightness(120%);
      }
    `
      : ""}
`;

const Toggle = (props: Props) => (
  <StyledToggle
    tabIndex={0}
    switchedOn={props.selected}
    onClick={() => props.onChange(!props.selected)}
  />
);

export default Toggle;
