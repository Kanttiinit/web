import { state } from '../state';
import PageContainer from './PageContainer';

export default function PrivacyPolicy() {
  return (
    <PageContainer title={state.translations.termsOfService}>
      {state.translations.termsOfServiceContent}
    </PageContainer>
  );
};
