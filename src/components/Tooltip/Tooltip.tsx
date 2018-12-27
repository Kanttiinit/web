import { observer } from 'mobx-react';
import Popper from 'popper.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { preferenceStore } from '../../store';
import translations from '../../utils/translations';
import * as styles from './Tooltip.scss';

type Props = {
  children: React.ReactNode;
  text?: string;
  translationKey?: keyof (typeof translations); // eslint-disable-line
  position?: Popper.Position;
  className?: string;
};

type State = {
  isOpen: boolean;
};

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
  };

  saveTooltipRef = (e: Element) => {
    if (e) {
      this.tooltip = e;
      this.updatePopper();
    }
  };

  updatePopper = () => {
    if (this.anchor && this.tooltip) {
      this.popper = new Popper(this.anchor, this.tooltip, {
        placement: this.props.position || 'bottom-start'
      });
    }
  };

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
            <div className={styles.tooltip} ref={this.saveTooltipRef}>
              {contents}
            </div>,
            document.body
          )}
      </React.Fragment>
    );
  }
}

export default Tooltip;
