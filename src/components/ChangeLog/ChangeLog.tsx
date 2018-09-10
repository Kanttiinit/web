import * as React from 'react';
import * as classnames from 'classnames';
import * as moment from 'moment';
import {
  MdSystemUpdateAlt,
  MdChangeHistory,
  MdModeEdit,
  MdBugReport
} from 'react-icons/md';

import * as css from './ChangeLog.scss';
import PageContainer from '../PageContainer';
import Text from '../Text';
import { Update } from '../../store/types';
import { preferenceStore, dataStore } from '../../store';
import { observer } from 'mobx-react';

const getIcon = (update: Update) => {
  switch (update.type) {
    case 'software-update':
      return MdSystemUpdateAlt;
    case 'information-update':
      return MdChangeHistory;
    case 'bugfix':
      return MdBugReport;
    default:
      return MdModeEdit;
  }
};

@observer
export default class ChangeLog extends React.Component {
  componentWillUnmount() {
    preferenceStore.updatesLastSeenAt = Date.now();
  }

  render() {
    const unseenUpdates = dataStore.unseenUpdates;
    return (
      <PageContainer title={<Text id="updates" />}>
        {dataStore.updates.pending ? (
          <p>Loading...</p>
        ) : (
          dataStore.updates.data.map(update => {
            const Icon = getIcon(update);
            return (
              <div
                className={classnames(
                  css.update,
                  unseenUpdates.some(u => u.id === update.id) && css.unseen
                )}
                key={update.id}
              >
                <Icon size={26} />
                <div className={css.meta}>
                  <p className={css.publishedAt}>
                    {moment(update.createdAt).fromNow()}
                  </p>
                  <p className={css.body}>{update.description}</p>
                </div>
              </div>
            );
          })
        )}
      </PageContainer>
    );
  }
}
