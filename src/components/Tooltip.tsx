import Popper from 'popper.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'solid-styled-components';

import { langContext } from '../contexts';
import translations from '../utils/translations';

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
  children: any;
  text?: string;
  translationKey?: keyof (typeof translations);
  position?: Popper.Position;
  className?: string;
}

const Tooltip = (props: Props): any => {
  const { lang } = React.useContext(langContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const popper = React.useRef<Popper>(null);

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  React.useLayoutEffect(() => {
    if (anchorRef.current && tooltipRef.current && isOpen) {
      popper.current = new Popper(anchorRef.current, tooltipRef.current, {
        placement: props.position || 'bottom-start'
      });
    }
  }, [tooltipRef.current, anchorRef.current, isOpen]);

  if (!props.text && !(props.translationKey in translations)) {
    return props.children;
  }

  const contents = props.text || translations[props.translationKey][lang];

  return (
    <>
      <span
        onMouseOver={open}
        onMouseLeave={close}
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
    </>
  );
};

export default Tooltip;
