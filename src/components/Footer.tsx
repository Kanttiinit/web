import { styled } from 'solid-styled-components';
import logo from '../assets/logo_48.png';
import { version } from '../consts';
import { breakSmall } from '../globalStyles';
import { GithubIcon } from '../icons';
import { computedState } from '../state';
import Link from './Link';
import PoweredByUpcloud from './PoweredByUpcloud';

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

const linkStyles = `
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

  @media (max-width: ${breakSmall}) {
    border-bottom: none;
    display: block;
    margin: 0.5rem;
  }
`;

const StyledNavLink = styled(Link)`
  ${linkStyles}
`;

const StyledExternalLink = styled.a`
  ${linkStyles}
  color: slateblue !important;
`;

const LogoImage = styled.img<{ darkMode: boolean }>`
  height: 48px;
  margin-right: 1rem;

  @media (max-width: ${breakSmall}) {
    display: none;
  }

  ${props => (props.darkMode ? 'filter: grayscale(0.6);' : '')}
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

export default () => {
  const showInfo = localStorage.getItem('isSurprise') === 'false';
  return (
    <Footer>
      <NavigationContainer>
        <LogoImage
          darkMode={computedState.darkMode()}
          alt="Kanttiinit logo"
          src={logo}
        />
        <nav>
          <StyledNavLink to="/contact">
            {computedState.translations().contact}
          </StyledNavLink>
          <StyledNavLink to="/clients">
            {computedState.translations().otherClients}
          </StyledNavLink>
          <StyledNavLink to="/news">
            {computedState.translations().updates}
          </StyledNavLink>
          <StyledNavLink to="/terms-of-service">
            {computedState.translations().termsOfService}
          </StyledNavLink>
          {showInfo && (
            <StyledExternalLink
              href="https://kanttiinit.github.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open source 👾
            </StyledExternalLink>
          )}
        </nav>
      </NavigationContainer>
      <div style={{ display: 'flex', 'align-items': 'center', gap: '1.5rem' }}>
        <PoweredByUpcloud />
        <VersionLink
          href='https://github.com/Kanttiinit/web'
          rel='noopener'
          target='_blank'
        >
          <GithubIcon style={{ 'vertical-align': 'middle', 'margin-right': '0.25rem' }} />
          v{version}
        </VersionLink>
      </div>
    </Footer>
  );
};
