import { For } from 'solid-js';
import { state } from '../../state';
import { properties } from '../../utils/translations';
import { RoundedButton, RoundedButtonContainer } from '../RoundedButton';

export default function PropertySelector(props: { showDesiredProperties?: boolean }) {
  const isPropertySelected = (propertyKey: string) =>
    state.properties.some(p => p.toLowerCase() === propertyKey.toLowerCase());

  return (
    <RoundedButtonContainer>
      <For each={properties.filter(p => (props.showDesiredProperties ? p.desired : !p.desired))}>
        {p =>
          <RoundedButton
            onClick={() => toggleProperty(p.key)}
            color={p.desired ? 'var(--friendly)' : 'var(--gray3)'}
            selected={isPropertySelected(p.key)}
          >
            {state.lang === 'fi' ? p.name_fi : p.name_en}
          </RoundedButton>
        }
      </For>
    </RoundedButtonContainer>
  );
};
