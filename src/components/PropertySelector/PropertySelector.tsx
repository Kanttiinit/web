import * as React from 'react';

import { langContext, propertyContext } from '../../contexts';
import { properties } from '../../utils/translations';
import { RoundedButton, RoundedButtonContainer } from '../Button/RoundedButton';

export default (props: { showDesiredProperties?: boolean }) => {
  const { lang } = React.useContext(langContext);
  const { toggleProperty, isPropertySelected } = React.useContext(
    propertyContext
  );
  return (
    <RoundedButtonContainer>
      {properties
        .filter(p => (props.showDesiredProperties ? p.desired : !p.desired))
        .map(p => (
          <RoundedButton
            onClick={() => toggleProperty(p.key)}
            color={p.desired ? 'var(--friendly)' : 'var(--gray3)'}
            selected={isPropertySelected(p.key)}
            key={p.key}
          >
            {lang === 'fi' ? p.name_fi : p.name_en}
          </RoundedButton>
        ))}
    </RoundedButtonContainer>
  );
};
