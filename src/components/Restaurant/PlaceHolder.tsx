import * as React from 'react';
import * as times from 'lodash/times';
import * as random from 'lodash/random';
import * as classnames from 'classnames';

const css = require('./Restaurant.scss');

export default class Placeholder extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <div className={classnames(css.container, css.placeholder)}>
        <div className={css.header} style={{ width: random(30, 40) + '%' }} />
        <div className={css.body}>
          {times(10, i => (
            <div
              key={i}
              className={css.course}
              style={{ width: random(40, 100) + '%' }}
            />
          ))}
        </div>
      </div>
    );
  }
}
