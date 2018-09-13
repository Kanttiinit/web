import * as React from 'react';
import * as classnames from 'classnames';
import { Collapse } from 'react-collapse';
import { MdKeyboardArrowDown } from 'react-icons/md';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as css from './ChangeLog.scss';
import PageContainer from '../PageContainer';
import Text from '../Text';
import { Update } from '../../store/types';
import { preferenceStore, dataStore } from '../../store';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

type State = {
  visibleItems: Array<number>;
};

@observer
export default class ChangeLog extends React.Component<any, State> {
  state = {
    visibleItems: []
  };

  cancelAutorun = null;

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
    });

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
              <div
                onClick={() => this.toggleVisible(update)}
                className={classnames(css.update, isVisible && css.visible)}
                key={update.id}
              >
                <MdKeyboardArrowDown className={css.icon} size={30} />
                <div className={css.meta}>
                  <p className={css.publishedAt}>
                    {distanceInWordsToNow(update.createdAt)}
                  </p>
                  <h3 className={css.title}>{update.title}</h3>
                  <Collapse
                    springConfig={{ stiffness: 300, damping: 20 }}
                    isOpened={isVisible}
                  >
                    <p className={css.body}>{update.description}</p>
                  </Collapse>
                </div>
              </div>
            );
          })
        )}
      </PageContainer>
    );
  }
}
