import * as React from 'react';

import styled from 'styled-components';
import PageContainer from './PageContainer';
import Text from './Text';

const Link = styled.a`
  font-size: 1.25em;
`;

const Clients = () => (
  <PageContainer title={<Text id="otherClients" />}>
    <Link href="https://folio.kanttiinit.fi/">folio.kanttiinit.fi</Link>
    <p>JavaScript-less version of Kanttiinit.</p>
    <Link href="https://github.com/Kanttiinit/cli" target="_blank">
      CLI
    </Link>
    <p>
      Command line interface written in C++ (no prebuilt binaries available yet).
    </p>
    <Link
      href="https://itunes.apple.com/fi/app/kanttiinit/id1069903670?mt=8"
      target="_blank"
    >
      iOS App
    </Link>
    ,{' '}
    <Link
      href="https://play.google.com/apps/testing/com.kanttiinit"
      target="_blank"
    >
      Android App
    </Link>
    <p>iOS and Android apps. Not actively maintained.</p>
  </PageContainer>
);

export default Clients;
