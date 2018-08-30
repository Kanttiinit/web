import * as React from 'react';
import * as moment from 'moment';
import {
  MdSystemUpdateAlt,
  MdChangeHistory,
  MdModeEdit,
  MdBugReport
} from 'react-icons/md';

import * as css from './ChangeLog.scss';
import { getUpdates } from '../../utils/api';
import PageContainer from '../PageContainer';
import Text from '../Text';
import { Release } from '../../store/types';

const getIcon = (release: Release) => {
  switch (release.type) {
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

export default class ChangeLog extends React.PureComponent {
  state = { updates: null };

  async updateReleases() {
    this.setState({ updates: await getUpdates() });
  }

  componentDidMount() {
    this.updateReleases();
  }

  renderRelease = (release: Release) => {
    const Icon = getIcon(release);
    return (
      <div className={css.release} key={release.id}>
        <Icon size={26} />
        <div className={css.meta}>
          <p className={css.publishedAt}>
            {moment(release.createdAt).fromNow()}
          </p>
          <p className={css.body}>{release.description}</p>
        </div>
      </div>
    );
  };

  render() {
    const { updates } = this.state;

    return (
      <PageContainer title={<Text id="updates" />}>
        {!updates ? <p>Loading...</p> : updates.map(this.renderRelease)}
      </PageContainer>
    );
  }
}
