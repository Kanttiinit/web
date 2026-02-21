import { useParams } from '@solidjs/router';

import {
  createResource,
  createSignal,
  For,
  type JSX,
  Match,
  Show,
  Switch,
  type ValidComponent,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { styled } from 'solid-styled-components';
import { createRestaurantChange, getRestaurant } from '../../api';
import { ClockIcon, ErrorIcon, LocationIcon, MoreIcon } from '../../icons';
import { computedState, state } from '../../state';
import type allTranslations from '../../translations';
import type { RestaurantType } from '../../types';
import Button from '../Button';
import InlineIcon from '../InlineIcon';
import PageContainer from '../PageContainer';
import LocationEditor from './LocationEditor';
import MessageForm from './MessageForm';
import OpeningHoursEditor from './OpeningHoursEditor';

export interface FormProps {
  restaurant: RestaurantType;
  isSending: boolean;
  goBack(): void;
  sendChange(change: any): void;
  setError(error?: Error): void;
  setDone(isDone: boolean): void;
}

const ListItem = styled(Button)`
  font-size: 1.25em;
  display: flex;
  align-items: center;
  text-transform: initial;
  padding: 0.5em 0.7em;
  border-radius: 0.25em;
  width: 100%;
  transition: background 0.2s;
  margin-bottom: 0.5em;
  outline: none;
  color: var(--gray1);
  background: none;

  svg {
    margin-right: 1ch;
    opacity: 0.9;
  }

  &:hover {
    background: var(--gray5);
  }
`;

const ErrorMessage = styled.p`
  && {
    color: var(--hearty);
  }
`;

interface ReportForm {
  component: ValidComponent;
  icon: JSX.Element;
  labelId: keyof typeof allTranslations;
}

const reportForms: ReportForm[] = [
  {
    component: OpeningHoursEditor,
    icon: <ClockIcon />,
    labelId: 'openingHours',
  },
  {
    component: LocationEditor,
    icon: <LocationIcon />,
    labelId: 'location',
  },
  {
    component: MessageForm,
    icon: <MoreIcon />,
    labelId: 'somethingElse',
  },
];

const ReportModal = () => {
  const [activeForm, setActiveForm] = createSignal<ReportForm | null>(null);
  const [error, setError] = createSignal<Error | null>(null);
  const [done, setDone] = createSignal(false);
  const [isSending, setIsSending] = createSignal(false);
  const params = useParams();
  const [restaurant] = createResource(
    () => ({
      id: Number(params.id),
      lang: state.preferences.lang,
    }),
    source => getRestaurant(source.id, source.lang),
  );

  const sendChange: FormProps['sendChange'] = async change => {
    setIsSending(true);
    try {
      const _response = await createRestaurantChange(restaurant()!.id, change);
      // preferences.addSuggestedUpdate(response.uuid);
      setDone(true);
      if (error()) {
        setError(null);
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsSending(false);
    }
  };

  const title = () =>
    !restaurant.loading
      ? computedState
          .translations()
          .fixRestaurantInformation.replace(
            '%restaurantName%',
            restaurant()?.name,
          )
      : '';

  return (
    <PageContainer title={title()} compactTitle>
      <Switch>
        <Match when={restaurant.loading}>Loading...</Match>
        <Match when={done()}>
          {computedState.translations().thanksForFeedback}
        </Match>
        <Match keyed when={activeForm()}>
          {form => (
            <>
              <Dynamic
                component={form.component}
                goBack={() => {
                  setActiveForm(null);
                  setError(null);
                }}
                isSending={isSending()}
                restaurant={restaurant()}
                sendChange={sendChange}
                setDone={setDone}
                setError={setError}
              />
              <Show keyed when={error()}>
                {error => (
                  <ErrorMessage>
                    <InlineIcon>
                      <ErrorIcon />
                    </InlineIcon>{' '}
                    {error.message}
                  </ErrorMessage>
                )}
              </Show>
            </>
          )}
        </Match>
        <Match when={true}>
          <For each={reportForms}>
            {form => (
              <ListItem onClick={() => setActiveForm(form)}>
                <InlineIcon>{form.icon}</InlineIcon>
                {computedState.translations()[form.labelId]}
              </ListItem>
            )}
          </For>
        </Match>
      </Switch>
    </PageContainer>
  );
};

export default ReportModal;
