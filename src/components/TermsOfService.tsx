import * as React from 'react';

import { useTranslations } from '../utils/hooks';
import PageContainer from './PageContainer';

const PrivacyPolicy = () => {
  const translations = useTranslations();
  return (
    <PageContainer title={translations.termsOfService}>
      {translations.termsOfServiceContent}
    </PageContainer>
  );
};

export default PrivacyPolicy;
