import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Text from '../Text';
const logo = require('../../assets/logo_48.png');
import { isBeta, version } from '../../utils/consts';

const Footer = styled.footer`
  text-align: center;
  color: var(--gray4);
  font-size: 0.8rem;
  letter-spacing: 0.05rem;
  padding: 1rem;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Navigation = styled.nav`
  a {
    color: var(--gray3);
    text-transform: uppercase;
    margin: 0 0.5rem;
    text-decoration: none;
    vertical-align: middle;
    border-bottom: solid 1px transparent;
    padding-bottom: 0.25rem;

    &.current {
      border-color: var(--accent_color);
      color: var(--accent_color);
    }

    &:hover {
      color: var(--accent_color);
    }

    @media (max-width: ${props => props.theme.breakSmall}) {
      border-bottom: none;
      display: block;
      margin: 0.5rem;
    }
  }
`;

const LogoImage = styled.img`
  height: 48px;
  margin-right: 1rem;

  @media (max-width: ${props => props.theme.breakSmall}) {
    display: none;
  }

  ${props => props.theme.dark && 'filter: grayscale(0.6);'}
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
`;

export default withRouter((props: RouteComponentProps<any>) => {
  const { search } = props.location;
  return (
    <Footer>
      <NavigationContainer>
        <LogoImage src={logo} />
        <Navigation>
          <NavLink to={{ pathname: '/contact', search }}>
            <Text id="contact" />
          </NavLink>
          <NavLink to={{ pathname: '/clients', search }}>
            <Text id="otherClients" />
          </NavLink>
          <NavLink to={{ pathname: '/news', search }}>
            <Text id="updates" />
          </NavLink>
          <NavLink to={{ pathname: '/terms-of-service', search }}>
            <Text id="termsOfService" />
          </NavLink>
          {!isBeta && (
            <a href="https://beta.kanttiinit.fi/" target="_blank">
              Beta
            </a>
          )}
        </Navigation>
      </NavigationContainer>
      <a href="https://github.com/Kanttiinit/web" target="_blank">
        {version}
      </a>
    </Footer>
  );
});
