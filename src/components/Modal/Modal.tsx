import * as React from 'react'
import {observer} from 'mobx-react'
import * as classnames from 'classnames'
import {withRouter} from 'react-router-dom'
import ErrorBoundary from 'react-error-boundary'

import {reportError} from '../../utils/api'
import PageContainer from '../PageContainer'
import Text from '../Text'
import { RouteComponentProps } from 'react-router';
const css = require('./Modal.scss')

const ModalError = () => (
  <PageContainer title={<Text id="error" />}>
    <Text id="errorDetails" component="p" />
  </PageContainer>
)

type Props = RouteComponentProps<any> & {
  children: any
}

@observer
class Modal extends React.Component<Props, {}> {

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    document.body.style.overflow = 'initial'
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      this.closeModal()
    }
  }

  closeModal = () => this.props.history.replace('/' + location.search)

  render() {
    return (
      <div className={classnames(css.container, css.open)}>
        <div className={css.overlay} onClick={this.closeModal}></div>
        <div className={css.content}>
          <ErrorBoundary onError={reportError} FallbackComponent={ModalError}>
            {this.props.children}
          </ErrorBoundary>
        </div>
        <div className={css.closeText} onClick={this.closeModal}>
          <Text id="closeModal" />
        </div>
      </div>
    )
  }
}

export default withRouter(Modal)
