import { observer } from 'mobx-react';
import Popper from 'popper.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { preferenceStore } from '../../store';
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

interface State {
  isOpen: boolean;
}

@observer
class Tooltip extends React.Component<Props, State> {
  state = { isOpen: false };
  anchor: Element;
  tooltip: Element;
  popper: Popper;

  saveAnchorRef = (e: Element) => {
    if (e) {
      this.anchor = e;
      this.updatePopper();
    }
  }

  saveTooltipRef = (e: Element) => {
    if (e) {
      this.tooltip = e;
      this.updatePopper();
    }
  }

  updatePopper = () => {
    if (this.anchor && this.tooltip) {
      this.popper = new Popper(this.anchor, this.tooltip, {
        placement: this.props.position || 'bottom-start'
      });
    }
  }

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  render() {
    const contents =
      this.props.text ||
      translations[this.props.translationKey][preferenceStore.lang];
    return (
      <React.Fragment>
        <span
          onMouseOver={this.open}
          onMouseOut={this.close}
          ref={this.saveAnchorRef}
          className={this.props.className}
        >
          {this.props.children}
        </span>
        {this.state.isOpen &&
          ReactDOM.createPortal(
            <Container ref={this.saveTooltipRef}>{contents}</Container>,
            document.body
          )}
      </React.Fragment>
    );
  }
}

export default Tooltip;
