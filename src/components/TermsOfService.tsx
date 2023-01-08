import { computedState } from '../state';
import PageContainer from './PageContainer';

export default function PrivacyPolicy() {
  return (
    <PageContainer title={computedState.translations().termsOfService}>
      {computedState.translations().termsOfServiceContent}
    </PageContainer>
  );
}
