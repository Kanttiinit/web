import React from 'react'

import css from './ChangeLog.scss'
import {getReleases} from '../../utils/api'
import PageContainer from '../PageContainer'

export default class ChangeLog extends React.PureComponent {
  state = {releases: null}

  async updateReleases() {
    this.setState({releases: await getReleases()})
  }

  componentDidMount() {
    this.updateReleases()
  }

  renderRelease = (release: any) => {
    return (
      <div key={release.name}>
        <h2 className={css.title}>{release.name}</h2>
        <p className={css.publishedAt}>released {release.publishedAt.fromNow()}</p>
        <p className={css.body}>
          {release.body.split('\n').map(part => [part, <br key={0} />])}
        </p>
      </div>
    )
  }

  render() {
    const {releases} = this.state

    return (
      <PageContainer title="Change log">
        {!releases ? <p>Loading...</p> : releases.map(this.renderRelease)}
      </PageContainer>
    )
  }
}
