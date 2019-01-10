import Popper from 'popper.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import preferenceContext from '../../contexts/preferencesContext';
import translations from '../../utils/translations';

const Container = styled.div`
  font-size: 0.8rem;
  position: absolute;
  background: var(--gray2);
  color: var(--gray7);
  padding: 0.25rem 0.5rem;
  margin: 1em;
  z-index: 99999;
  white-space: nowrap;
  pointer-events: none;
  border-radius: 0.25rem;
`;

interface Props {
  children: React.ReactNode;
  text?: string;
  translationKey?: keyof (typeof translations); // eslint-disable-line
  position?: Popper.Position;
  className?: string;
}

const Tooltip = (props: Props) => {
  const preferences = React.useContext(preferenceContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const popper = React.useRef<Popper>(null);
  const contents =
    props.text || translations[props.translationKey][preferences.lang];

  const open = React.useCallback(() => setIsOpen(true), []);

  const close = React.useCallback(() => setIsOpen(false), []);

  React.useEffect(
    () => {
      if (anchorRef.current && tooltipRef.current) {
        popper.current = new Popper(anchorRef.current, tooltipRef.current, {
          placement: props.position || 'bottom-start'
        });

        return () => popper.current.destroy();
      }
    },
    [tooltipRef.current, anchorRef.current]
  );

  return (
    <React.Fragment>
      <span
        onMouseOver={open}
        onMouseOut={close}
        ref={anchorRef}
        className={props.className}
      >
        {props.children}
      </span>
      {isOpen &&
        ReactDOM.createPortal(
          <Container ref={tooltipRef}>{contents}</Container>,
          document.body
        )}
    </React.Fragment>
  );
};

export default Tooltip;
