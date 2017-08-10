// @flow
import React from 'react'
import {autorun} from 'mobx'
import {observer} from 'mobx-react'
import classnames from 'classnames'
import Collapse from 'react-collapse'

import {uiState} from '../store'
import CourseList from './CourseList'
import DaySelector from './DaySelector'
import {getCourses} from '../utils/api'
import css from '../styles/MenuViewer.scss'

type Props = {|
  restaurantId: number
|};

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
  };

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
    return (
      <div className={css.container}>
        <DaySelector />
        <Collapse isOpened>
          <CourseList
            className={classnames(css.courseList, loading && css.coursesLoading)}
            courses={courses} />
        </Collapse>
      </div>
    )
  }
}