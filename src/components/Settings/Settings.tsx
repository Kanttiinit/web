import type { JSXElement } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakSmall } from '../../globalStyles';
import { computedState, setState, state } from '../../state';
import { DarkModeChoice, HighlighOperator, Lang, Order } from '../../types';
import FavoriteSelector from '../FavoriteSelector';
import PageContainer from '../PageContainer';
import Radio from '../Radio';
import Toggle from '../Toggle';
import PriceCategorySelector from './PriceCategorySelector';
import PropertySelector from './PropertySelector';

const SettingsCard = styled.div`
  background: var(--bg-inset);
  border-radius: var(--radius-lg);
  padding: 0.25rem 0;
  margin-bottom: 0.75rem;
  overflow: hidden;
`;

const SettingsRow = styled.div<{ column?: boolean; mobileColumn?: boolean }>`
  display: flex;
  align-items: ${props => (props.column ? 'flex-start' : 'center')};
  flex-direction: ${props => (props.column ? 'column' : 'row')};
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1rem;

  & + & {
    border-top: 1px solid var(--border-subtle);
  }

  @media (max-width: ${breakSmall}) {
    ${props =>
      props.mobileColumn
        ? 'flex-direction: column; align-items: flex-start;'
        : ''}
  }
`;

const RowLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const orders = [Order.AUTOMATIC, Order.ALPHABET, Order.DISTANCE];

const languageOptions = [
  { label: 'Finnish', value: Lang.FI },
  { label: 'English', value: Lang.EN },
];

interface RowProps {
  label: JSXElement;
  children: JSXElement;
  column?: boolean;
  mobileColumn?: boolean;
}

const Row = (props: RowProps) => (
  <SettingsRow column={props.column} mobileColumn={props.mobileColumn}>
    <RowLabel>{props.label}</RowLabel>
    {props.children}
  </SettingsRow>
);

const Settings = () => {
  return (
    <PageContainer title={computedState.translations().settings}>
      <SettingsCard>
        <Row label={computedState.translations().language}>
          <Radio
            options={languageOptions}
            selected={state.preferences.lang}
            onChange={value => setState('preferences', 'lang', value)}
          />
        </Row>
        <Row label={computedState.translations().theme}>
          <Radio
            options={[
              {
                label: computedState.translations().default,
                value: DarkModeChoice.DEFAULT,
              },
              {
                label: computedState.translations().light,
                value: DarkModeChoice.OFF,
              },
              {
                label: computedState.translations().dark,
                value: DarkModeChoice.ON,
              },
            ]}
            selected={state.preferences.darkMode}
            onChange={value => setState('preferences', 'darkMode', value)}
          />
        </Row>
      </SettingsCard>
      <SettingsCard>
        <Row label={computedState.translations().order} mobileColumn>
          <Radio
            options={orders.map(order => ({
              label: computedState.translations()[order],
              value: order,
            }))}
            selected={state.preferences.order}
            onChange={value => setState('preferences', 'order', value)}
          />
        </Row>
        <Row label={computedState.translations().useLocation}>
          <Toggle
            selected={state.preferences.useLocation}
            onChange={value => setState('preferences', 'useLocation', value)}
          />
        </Row>
      </SettingsCard>
      <SettingsCard>
        <Row label={computedState.translations().priceCategory} column>
          <PriceCategorySelector
            value={state.preferences.maxPriceCategory}
            onChange={value =>
              setState('preferences', 'maxPriceCategory', value)
            }
          />
        </Row>
      </SettingsCard>
      <SettingsCard>
        <Row label={computedState.translations().highlightDiets} column>
          <PropertySelector showDesiredProperties />
        </Row>
        <Row
          label={computedState.translations().highlightOperator}
          mobileColumn
        >
          <Radio
            options={[
              {
                label: computedState.translations().and,
                value: HighlighOperator.AND,
              },
              {
                label: computedState.translations().or,
                value: HighlighOperator.OR,
              },
            ]}
            selected={state.preferences.highlightOperator}
            onChange={value =>
              setState('preferences', 'highlightOperator', value)
            }
          />
        </Row>
        <Row label={computedState.translations().avoidDiets} column>
          <PropertySelector />
        </Row>
      </SettingsCard>
      <SettingsCard>
        <Row label={computedState.translations().prioritize} column>
          <FavoriteSelector />
        </Row>
      </SettingsCard>
    </PageContainer>
  );
};

export default Settings;
