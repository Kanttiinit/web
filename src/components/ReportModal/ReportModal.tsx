import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import {
  MdAccessTime,
  MdError,
  MdPlace,
  MdQuestionAnswer
} from 'react-icons/md';
import styled from 'styled-components';

import { langContext, preferenceContext } from '../../contexts';
import { RestaurantType } from '../../contexts/types';
import { createRestaurantChange, getRestaurant } from '../../utils/api';
import { useTranslations } from '../../utils/hooks';
import allTranslations from '../../utils/translations';
import useResource from '../../utils/useResource';
import Button from '../Button';
import InlineIcon from '../InlineIcon';
import PageContainer from '../PageContainer';
import LocationEditor from './LocationEditor';
import MessageForm from './MessageForm';
import OpeningHoursEditor from './OpeningHoursEditor';

interface Props {
  restaurantId: number;
}

export interface FormProps {
  restaurant: RestaurantType;
  isSending: boolean;
  goBack(): void;
  sendChange(change: any): void;
  setError(error?: Error): void;
  setDone(isDone: boolean): void;
}

const ListItem = styled(Button).attrs({ variant: 'text' })`
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
  component: React.FC<FormProps>;
  icon: JSX.Element;
  labelId: keyof (typeof allTranslations);
}

const reportForms: ReportForm[] = [
  {
    component: OpeningHoursEditor,
    icon: <MdAccessTime />,
    labelId: 'openingHours'
  },
  {
    component: LocationEditor,
    icon: <MdPlace />,
    labelId: 'location'
  },
  {
    component: MessageForm,
    icon: <MdQuestionAnswer />,
    labelId: 'somethingElse'
  }
];

const ReportModal = (props: Props) => {
  const translations = useTranslations();
  const [activeForm, setActiveForm] = React.useState(null);
  const [error, setError] = React.useState<Error>(null);
  const [done, setDone] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const preferences = React.useContext(preferenceContext);
  const { lang } = React.useContext(langContext);
  const [restaurant, setRestaurant] = useResource<RestaurantType>(null);

  React.useEffect(() => {
    setRestaurant(getRestaurant(props.restaurantId, lang));
  }, []);

  const sendChange: FormProps['sendChange'] = async change => {
    setIsSending(true);
    try {
      const response = await createRestaurantChange(restaurant.data.id, change);
      preferences.addSuggestedUpdate(response.uuid);
      setDone(true);
      if (error) {
        setError(null);
      }
    } catch (e) {
      setError(e);
    } finally {
      setIsSending(false);
    }
  };

  const title = restaurant.fulfilled
    ? translations.fixRestaurantInformation.replace(
        '%restaurantName%',
        restaurant.data.name
      )
    : '';

  if (restaurant.pending) {
    return null;
  }

  return (
    <MuiThemeProvider
      theme={createMuiTheme({
        palette: {
          type: preferences.darkMode ? 'dark' : 'light'
        }
      })}
    >
      <PageContainer title={title}>
        {done ? (
          translations.thanksForFeedback
        ) : activeForm ? (
          <>
            {React.createElement(activeForm.component, {
              goBack: () => (setActiveForm(null), setError(null)),
              isSending,
              restaurant: restaurant.data,
              sendChange,
              setDone,
              setError
            })}
            {error && (
              <ErrorMessage>
                <InlineIcon>
                  <MdError />
                </InlineIcon>{' '}
                {error.message}
              </ErrorMessage>
            )}
          </>
        ) : (
          reportForms.map(form => (
            <ListItem key={form.labelId} onClick={() => setActiveForm(form)}>
              <InlineIcon>{form.icon}</InlineIcon>
              {translations[form.labelId]}
            </ListItem>
          ))
        )}
      </PageContainer>
    </MuiThemeProvider>
  );
};

export default ReportModal;
