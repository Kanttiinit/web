import distanceInWordsToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import snarkdown from 'snarkdown';
import { createSignal, For, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Update } from '../types';
import { computedState, setState, resources } from '../state';
import Collapse from './Collapse';
import PageContainer from './PageContainer';
import { CaretDownIcon } from '../icons';

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

const ArrowDownIcon = styled(CaretDownIcon)<{ isVisible: boolean }>`
  margin-top: 0.4em;
  transition: transform 0.3s;
  ${props => props.isVisible ? 'transform: rotateX(180deg);' : ''}
`;

const ChangeLog = () => {
  const [visibleItems, setVisibleItems] = createSignal(
    computedState.unseenUpdates().map(update => update.id)
  );

  const toggleVisible = (update: Update) => {
    if (visibleItems().indexOf(update.id) > -1) {
      setVisibleItems(visibleItems().filter(id => id !== update.id));
    } else {
      setVisibleItems([...visibleItems(), update.id]);
    }
  };

  onMount(() => {
    setState('preferences', 'updatesLastSeenAt', Date.now());
  });

  const [updates] = resources.updates;

  return (
    <PageContainer title={computedState.translations().updates}>
      {updates.loading ? (
        <p>Loading...</p>
      ) : (
        <For each={updates()}>
          {update => {
            const isVisible = visibleItems().some(id => update.id === id);
            return (
              <UpdateWrapper
                onClick={() => toggleVisible(update)}
              >
                <ArrowDownIcon isVisible={isVisible} size={30} />
                <UpdateContent>
                  <PublishedAt>
                    {distanceInWordsToNow(parseISO(update.createdAt))}
                  </PublishedAt>
                  <Title>{update.title}</Title>
                  <Collapse isOpen={isVisible}>
                    <Body innerHTML={snarkdown(update.description)} />
                  </Collapse>
                </UpdateContent>
              </UpdateWrapper>
            );
          }}
        </For>
      )}
    </PageContainer>
  );
};

export default ChangeLog;
