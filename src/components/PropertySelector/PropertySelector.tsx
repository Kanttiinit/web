import * as React from 'react';

import preferenceContext from '../../contexts/preferencesContext';
import { properties } from '../../utils/translations';
import { RoundedButton, RoundedButtonContainer } from '../Button/RoundedButton';

export default (props: { showDesiredProperties?: boolean }) => {
  const preferences = React.useContext(preferenceContext);
  return (
    <RoundedButtonContainer>
      {properties
        .filter(p => (props.showDesiredProperties ? p.desired : !p.desired))
        .map(p => (
          <RoundedButton
            onClick={() => preferences.toggleProperty(p.key)}
            color={p.desired ? 'var(--friendly)' : 'var(--gray3)'}
            selected={preferences.isPropertySelected(p.key)}
            key={p.key}
          >
            {preferences.lang === 'fi' ? p.name_fi : p.name_en}
          </RoundedButton>
        ))}
    </RoundedButtonContainer>
  );
};
