// @flow
import React from 'react'
import {autorun} from 'mobx'
import {observer} from 'mobx-react'
import classnames from 'classnames'
import CopyIcon from 'react-icons/lib/md/content-copy'

import {uiState} from '../store'
import CourseList from './CourseList'
import DaySelector from './DaySelector'
import {getCourses} from '../utils/api'
import css from '../styles/MenuViewer.scss'

type Props = {|
  restaurantId: number,
  showCopyButton?: boolean,
  maxHeight?: number
|}

@observer
export default class MenuViewer extends React.PureComponent {
  removeAutorun: Function;
  props: Props;
  state: {
    courses: Array<any>,
    loading: boolean,
    error: ?Error
  } = {
    courses: [],
    loading: false,
    error: null
  }

  onCopy = () => {
    this.refs.textarea.select()
    document.execCommand('copy')
  }

  componentDidMount() {
    this.removeAutorun = autorun(async () => {
      try {
        this.setState({loading: true})
        const courses = await getCourses(this.props.restaurantId, uiState.day)
        this.setState({courses, loading: false, error: null})
      } catch (error) {
        this.setState({error, loading: false})
      }
    })
  }

  componentWillUnmount() {
    this.removeAutorun()
  }

  render() {
    const {courses, loading} = this.state
    const {showCopyButton} = this.props
    return (
      <div className={css.container}>
        <div className={css.header}>
          <DaySelector root={location.pathname} />
          {showCopyButton &&
            <div className={css.copyButton}>
              <textarea
                ref="textarea"
                value={courses.map(c => `${c.title} (${c.properties.join(', ')})`).join('\n')} />
              <CopyIcon
                size={18}
                onClick={this.onCopy} />
            </div>
          }
        </div>
        <CourseList
          className={classnames(css.courseList, loading && css.coursesLoading)}
          courses={courses} />
      </div>
    )
  }
}