import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import Text from '../Text';
const logo = require('../../assets/logo_48.png');
import * as css from './Footer.scss';
import { isBeta, version } from '../../utils/consts';

export default withRouter((props: RouteComponentProps<any>) => {
  const { search } = props.location;
  return (
    <footer className={css.container}>
      <div className={css.bottomRow}>
        <div className={css.logo}>
          <img src={logo} />
          <nav>
            <NavLink
              to={{ pathname: '/contact', search }}
              activeClassName={css.current}
            >
              <Text id="contact" />
            </NavLink>
            <NavLink
              to={{ pathname: '/clients', search }}
              activeClassName={css.current}
            >
              <Text id="otherClients" />
            </NavLink>
            <NavLink
              to={{ pathname: '/news', search }}
              activeClassName={css.current}
            >
              <Text id="updates" />
            </NavLink>
            <NavLink
              to={{ pathname: '/terms-of-service', search }}
              activeClassName={css.current}
            >
              <Text id="termsOfService" />
            </NavLink>
            {!isBeta && (
              <a href="https://beta.kanttiinit.fi/" target="_blank">
                Beta
              </a>
            )}
          </nav>
        </div>
        <a href="https://github.com/Kanttiinit/web" target="_blank">
          {version}
        </a>
      </div>
    </footer>
  );
});
