import * as React from 'react';
const css = require('./Toggle.scss');

export default class Toggle extends React.PureComponent {
  props: {
    onChange: (value: boolean) => void;
    selected: boolean;
    className?: string;
    style?: Object;
  };

  render() {
    const { selected, className, onChange } = this.props;
    return (
      <div className={className}>
        <span
          tabIndex={0}
          onClick={() => onChange(!selected)}
          className={
            css.toggle + (selected ? ' ' + css.toggleOn : ' ' + css.toggleOff)
          }
        />
      </div>
    );
  }
}
