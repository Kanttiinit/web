import * as React from 'react'
import {autorun} from 'mobx'
import {observer} from 'mobx-react'
import * as classnames from 'classnames'
import * as CopyIcon from 'react-icons/lib/md/content-copy'
import * as LinkIcon from 'react-icons/lib/md/link'

import {uiState, preferenceStore} from '../../store'
import CourseList from '../CourseList'
import DaySelector from '../DaySelector'
import {getCourses} from '../../utils/api'
const css = require('./MenuViewer.scss')

type Props = {
  restaurantId: number,
  showCopyButton?: boolean,
  maxHeight?: number
}

@observer
export default class MenuViewer extends React.Component {
  removeAutorun: Function;
  props: Props;
  state: {
    courses: Array<any>,
    loading: boolean,
    error: Error | null
  } = {
    courses: [],
    loading: false,
    error: null
  }

  onCopy = (target: string) => {
    const textArea = document.createElement('textarea')
    if (target === 'courses') {
      textArea.value = this.state.courses.map(c => `${c.title} (${c.properties.join(', ')})`).join('\n')
    } else  if (target === 'url') {
      textArea.value = location.href
    }
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
  }

  componentDidMount() {
    this.removeAutorun = autorun(async () => {
      try {
        this.setState({loading: true})
        const courses = await getCourses(this.props.restaurantId, uiState.day, preferenceStore.lang)
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
            <div className={css.copyButtons}>
              <LinkIcon
                size={18}
                onClick={() => this.onCopy('url')} />
              <CopyIcon
                size={18}
                onClick={() => this.onCopy('courses')} />
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