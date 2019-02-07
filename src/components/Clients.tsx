import * as React from 'react';

import styled from 'styled-components';
import { useTranslations } from '../utils/hooks';
import PageContainer from './PageContainer';

const Link = styled.a`
  font-size: 1.25em;
`;

const Clients = () => {
  const translations = useTranslations();
  return (
    <PageContainer title={translations.otherClients}>
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
      ,{' '}
      <Link
        href="https://play.google.com/apps/testing/com.kanttiinit"
        target="_blank"
        rel="noopener"
      >
        Android App
      </Link>
      <p>iOS and Android apps. Not actively maintained.</p>
    </PageContainer>
  );
};

export default Clients;
