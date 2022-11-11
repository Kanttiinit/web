import { styled } from 'solid-styled-components';
import { computedState } from '../state';
import PageContainer from './PageContainer';

const Link = styled.a`
  font-size: 1.25em;
`;

const Clients = () => {
  return (
    <PageContainer title={computedState.translations().otherClients}>
      <Link href="https://folio.kanttiinit.fi/" rel="noopener">
        folio.kanttiinit.fi
      </Link>
      <p>JavaScript-less version of Kanttiinit.</p>
      <Link
        href="https://github.com/Kanttiinit/cli"
        rel="noopener"
        target="_blank"
      >
        CLI
      </Link>
      <p>
        Command line interface written in C++ (no prebuilt binaries available
        yet).
      </p>
      <Link
        href="https://itunes.apple.com/fi/app/kanttiinit/id1069903670?mt=8"
        target="_blank"
        rel="noopener"
      >
        iOS App
      </Link>
      <p>iOS app, now receiving frequent bug fixes and feature updates.</p>
    </PageContainer>
  );
};

export default Clients;
