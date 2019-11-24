import * as React from 'react';
import styled, { css } from 'styled-components';

const logo = require('../assets/logo_48.png');
import { isBeta, version } from '../utils/consts';
import { useTranslations } from '../utils/hooks';
import Link from './Link';

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

const linkStyles = css`
  && {
    color: var(--gray2);
    text-transform: uppercase;
    margin: 0 0.5rem;
    text-decoration: none;
    vertical-align: middle;
    border-bottom: solid 1px transparent;
    padding-bottom: 0.25rem;
    font-weight: 500;

    &.current {
      border-color: var(--accent_color);
      color: var(--accent_color);
    }

    &:hover {
      color: var(--accent_color);
    }

    &:focus {
      outline: none;
      color: var(--accent_color);
    }

    @media (max-width: ${props => props.theme.breakSmall}) {
      border-bottom: none;
      display: block;
      margin: 0.5rem;
    }
  }
`;

const StyledNavLink = styled(Link)`
  ${linkStyles}
`;

const StyledExternalLink = styled.a`
  ${linkStyles}
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

const VersionLink = styled.a`
  && {
    font-weight: 500;
    color: var(--gray2);

    &:hover {
      color: var(--accent_color);
    }
  }
`;

export default ({ root }: { root: string }) => {
  const translations = useTranslations();
  return (
    <Footer>
      <NavigationContainer>
        <LogoImage alt="Kanttiinit logo" src={logo} />
        <nav>
          <StyledNavLink to={root + '/contact'}>
            {translations.contact}
          </StyledNavLink>
          <StyledNavLink to={root + '/clients'}>
            {translations.otherClients}
          </StyledNavLink>
          <StyledNavLink to={root + '/news'}>
            {translations.updates}
          </StyledNavLink>
          <StyledNavLink to={root + '/terms-of-service'}>
            {translations.termsOfService}
          </StyledNavLink>
          {!isBeta && (
            <StyledExternalLink
              href="https://beta.kanttiinit.fi/"
              rel="noopener"
              target="_blank"
            >
              Beta
            </StyledExternalLink>
          )}
        </nav>
      </NavigationContainer>
      <VersionLink
        href="https://github.com/Kanttiinit/web"
        rel="noopener"
        target="_blank"
      >
        {version}
      </VersionLink>
    </Footer>
  );
};
