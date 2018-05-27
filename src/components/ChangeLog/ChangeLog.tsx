import * as React from 'react';
import * as moment from 'moment';
import * as SWUpdateIcon from 'react-icons/lib/md/system-update-alt';
import * as UpdateIcon from 'react-icons/lib/md/change-history';
import * as EditIcon from 'react-icons/lib/md/edit';
import * as BugIcon from 'react-icons/lib/md/bug-report';

import * as css from './ChangeLog.scss';
import { getUpdates } from '../../utils/api';
import PageContainer from '../PageContainer';
import Text from '../Text';
import { Release } from '../../store/types';

const getIcon = (release: Release) => {
  switch (release.type) {
    case 'software-update':
      return SWUpdateIcon;
    case 'information-update':
      return EditIcon;
    case 'bugfix':
      return BugIcon;
    default:
      return UpdateIcon;
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
