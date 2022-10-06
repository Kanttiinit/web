import distanceInWordsToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import * as React from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import snarkdown from 'snarkdown';
import styled from 'styled-components';

import { dataContext, preferenceContext } from '../../contexts';
import { Update } from '../../contexts/types';
import { useTranslations, useUnseenUpdates } from '../../utils/hooks';
import Collapse from '../Collapse';
import PageContainer from '../PageContainer';

const UpdateWrapper = styled.div`
  margin-bottom: 0.5em;
  display: flex;
  color: var(--gray2);
  padding: 0.5em;
  border-radius: 0.2em;
  cursor: pointer;

  &:hover {
    background: var(--gray5);
  }

  &:last-child {
    margin: 0;
  }
`;

const UpdateContent = styled.div`
  flex: 1;
  margin-left: 1ch;
`;

const Body = styled.p`
  margin: 0;
  line-height: 1.25em;
`;

const Title = styled.h3`
  margin: 0 0 0.1em 0;
`;

const PublishedAt = styled.p`
  font-size: 0.7em;
  text-transform: uppercase;
  font-weight: 500;
  margin: 0 0 0;
  color: var(--gray2) !important;
`;

const ArrowDownIcon = styled(props => <MdKeyboardArrowDown {...props} />)<{
  isVisible: boolean;
}>`
  margin-top: 0.4em;
  transition: transform 0.3s;
  ${props => props.isVisible && 'transform: rotateX(180deg);'}
`;

const ChangeLog = () => {
  const data = React.useContext(dataContext);
  const translations = useTranslations();
  const preferences = React.useContext(preferenceContext);
  const unseenUpdates = useUnseenUpdates();
  const [visibleItems, setVisibleItems] = React.useState(
    unseenUpdates.map(update => update.id)
  );

  const toggleVisible = React.useCallback(
    (update: Update) => {
      if (visibleItems.indexOf(update.id) > -1) {
        setVisibleItems(visibleItems.filter(id => id !== update.id));
      } else {
        setVisibleItems([...visibleItems, update.id]);
      }
    },
    [visibleItems]
  );

  React.useEffect(() => {
    preferences.setUpdatesLastSeenAt(Date.now());
  }, []);

  return (
    <PageContainer title={translations.updates}>
      {data.updates.pending ? (
        <p>Loading...</p>
      ) : (
        data.updates.data.map(update => {
          const isVisible = visibleItems.some(id => update.id === id);
          return (
            <UpdateWrapper
              onClick={() => toggleVisible(update)}
              key={update.id}
            >
              <ArrowDownIcon isVisible={isVisible} size={30} />
              <UpdateContent>
                <PublishedAt>
                  {distanceInWordsToNow(parseISO(update.createdAt))}
                </PublishedAt>
                <Title>{update.title}</Title>
                <Collapse isOpen={isVisible}>
                  <Body
                    dangerouslySetInnerHTML={{
                      __html: snarkdown(update.description)
                    }}
                  />
                </Collapse>
              </UpdateContent>
            </UpdateWrapper>
          );
        })
      )}
    </PageContainer>
  );
};

export default ChangeLog;
