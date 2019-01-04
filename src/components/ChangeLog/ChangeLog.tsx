import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { autorun, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Collapse } from 'react-collapse';
import { MdKeyboardArrowDown } from 'react-icons/md';
import snarkdown from 'snarkdown';
import styled from 'styled-components';

import { dataStore, preferenceStore } from '../../store';
import { Update } from '../../store/types';
import PageContainer from '../PageContainer';
import Text from '../Text';

interface State {
  visibleItems: number[];
}

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

const Body = styled.p<{ isVisible: boolean }>`
  margin: 0;
  line-height: 1.25em;
  display: ${props => (props.isVisible ? 'block' : 'none')};
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

const ArrowDownIcon = styled(MdKeyboardArrowDown)<{ isVisible: boolean }>`
  margin-top: 0.4em;
  transition: transform 0.3s;
  ${props => props.isVisible && 'transform: rotateX(180deg);'}
`;

export default observer(
  class ChangeLog extends React.Component<any, State> {
    state: State = {
      visibleItems: []
    };

    cancelAutorun: IReactionDisposer = null;

    toggleVisible = (update: Update) =>
      this.setState(state => {
        if (state.visibleItems.indexOf(update.id) > -1) {
          return {
            visibleItems: state.visibleItems.filter(id => id !== update.id)
          };
        } else {
          return {
            visibleItems: [...state.visibleItems, update.id]
          };
        }
      })

    componentWillUnmount() {
      preferenceStore.updatesLastSeenAt = Date.now();
      this.cancelAutorun();
    }

    componentDidMount() {
      this.cancelAutorun = autorun(() => {
        this.setState({
          visibleItems: dataStore.unseenUpdates.map(update => update.id)
        });
      });
    }

    render() {
      return (
        <PageContainer title={<Text id="updates" />}>
          {dataStore.updates.pending ? (
            <p>Loading...</p>
          ) : (
            dataStore.updates.data.map(update => {
              const isVisible = this.state.visibleItems.some(
                id => update.id === id
              );
              return (
                <UpdateWrapper
                  onClick={() => this.toggleVisible(update)}
                  key={update.id}
                >
                  <ArrowDownIcon isVisible={isVisible} size={30} />
                  <UpdateContent>
                    <PublishedAt>
                      {distanceInWordsToNow(update.createdAt)}
                    </PublishedAt>
                    <Title>{update.title}</Title>
                    <Collapse
                      springConfig={{ stiffness: 300, damping: 20 }}
                      isOpened={isVisible}
                    >
                      <Body
                        isVisible={isVisible}
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
    }
  }
);
