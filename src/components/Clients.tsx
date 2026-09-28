import { styled } from 'solid-styled-components';
import { computedState } from '../state';
import PageContainer from './PageContainer';

const Link = styled.a`
  font-size: 1.25em;
`;

const Clients = () => {
  return (
    <PageContainer title={computedState.translations().otherClients}>
      <Link
        href="https://apps.apple.com/fi/app/kanttiinit-fi/id6814973609"
        target="_blank"
        rel="noopener"
      >
        iOS App
      </Link>
      <p>iOS app, now receiving frequent bug fixes and feature updates.</p>
      <Link href="https://folio.kanttiinit.fi/" rel="noopener">
        folio.kanttiinit.fi
      </Link>
      <p>JavaScript-less version of Kanttiinit.</p>
    </PageContainer>
  );
};

export default Clients;
