import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { MdAccessTime, MdPlace, MdQuestionAnswer } from 'react-icons/md';
import styled from 'styled-components';

import { langContext, preferenceContext } from '../../contexts';
import { RestaurantType } from '../../contexts/types';
import { getRestaurant } from '../../utils/api';
import translations from '../../utils/translations';
import useResource from '../../utils/useResource';
import Button from '../Button';
import InlineIcon from '../InlineIcon';
import PageContainer from '../PageContainer';
import Text from '../Text';
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
  send(request: Promise<{ uuid: string }>): void;
}

const ListItem = styled(Button).attrs({ type: 'text' })`
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

  svg {
    margin-right: 1ch;
    opacity: 0.9;
  }

  &:hover {
    background: var(--gray5);
  }
`;

const reportForms = [
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

  const send: FormProps['send'] = async promise => {
    setIsSending(true);
    try {
      await promise;
      setDone(true);
      if (error) {
        setError(null);
      }
    } catch (e) {
      setError(error);
    } finally {
      setIsSending(false);
    }
  };

  const title = restaurant.fulfilled
    ? translations.fixRestaurantInformation[lang]
        .toString()
        .replace('%restaurantName%', restaurant.data.name)
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
          <Text id="thanksForFeedback" />
        ) : activeForm ? (
          React.createElement(activeForm.component, {
            goBack: () => setActiveForm(null),
            isSending,
            restaurant: restaurant.data,
            send
          })
        ) : (
          reportForms.map(form => (
            <ListItem key={form.labelId} onClick={() => setActiveForm(form)}>
              <InlineIcon>{form.icon}</InlineIcon>
              <Text id={form.labelId} />
            </ListItem>
          ))
        )}
      </PageContainer>
    </MuiThemeProvider>
  );
};

export default ReportModal;
