import { observer } from 'mobx-react';
import * as React from 'react';

import { preferenceStore } from '../../store';
import { properties } from '../../utils/translations';
import { RoundedButton, RoundedButtonContainer } from '../Button/RoundedButton';

export default observer(({ showDesiredProperties }) => (
  <RoundedButtonContainer>
    {properties
      .filter(p => (showDesiredProperties ? p.desired : !p.desired))
      .map(p => (
        <RoundedButton
          onClick={() => preferenceStore.toggleProperty(p.key)}
          color={p.desired ? 'var(--friendly)' : 'var(--gray3)'}
          selected={preferenceStore.isPropertySelected(p.key)}
          key={p.key}
        >
          {preferenceStore.lang === 'fi' ? p.name_fi : p.name_en}
        </RoundedButton>
      ))}
  </RoundedButtonContainer>
));
