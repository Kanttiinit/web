import * as React from 'react';
import styled from 'styled-components';

import Text from '../Text';
const logo = require('../../assets/logo_48.png');
import { isBeta, version } from '../../utils/consts';
import Link from '../Link';

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

const StyledNavLink = styled(Link)`
  && {
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

export default () => (
  <Footer>
    <NavigationContainer>
      <LogoImage src={logo} />
      <nav>
        <StyledNavLink to="/contact">
          <Text id="contact" />
        </StyledNavLink>
        <StyledNavLink to="/clients">
          <Text id="otherClients" />
        </StyledNavLink>
        <StyledNavLink to="/news">
          <Text id="updates" />
        </StyledNavLink>
        <StyledNavLink to="/terms-of-service">
          <Text id="termsOfService" />
        </StyledNavLink>
        {!isBeta && (
          <a href="https://beta.kanttiinit.fi/" target="_blank">
            Beta
          </a>
        )}
      </nav>
    </NavigationContainer>
    <a href="https://github.com/Kanttiinit/web" target="_blank">
      {version}
    </a>
  </Footer>
);
