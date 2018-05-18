import * as React from 'react';

import PageContainer from './PageContainer';
import Text from './Text';

const PrivacyPolicy = () => (
  <PageContainer title={<Text id="termsOfService" />}>
    <Text id="termsOfServiceContent" />
  </PageContainer>
);

export default PrivacyPolicy;
