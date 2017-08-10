// @flow
import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import Collapse from 'react-collapse'

import CourseList from './CourseList'
import DaySelector from './DaySelector'
import {getCourses} from '../utils/api'
import css from '../styles/MenuViewer.scss'

type Props = {|
  restaurantId: number,
  day: moment.Moment,
  onDayChange: moment.Moment => void
|};

export default class MenuViewer extends React.PureComponent {
  state: {
    courses: Array<any>,
    loading: boolean,
    error: ?Error
  } = {
    courses: [],
    loading: false,
    error: null
  };

  updateMenu = async (props: Props) => {
    if (props.restaurantId && props.day) {
      try {
        this.setState({loading: true})
        const courses = await getCourses(props.restaurantId, props.day)
        this.setState({courses, loading: false, error: null})
      } catch (error) {
        this.setState({error, loading: false})
      }
    }
  }

  onDayChange = (offset: number) => {
    const day = moment().add({day: offset})
    this.props.onDayChange(day)
  }

  componentWillReceiveProps(props: Props) {
    this.updateMenu(props)
  }

  componentDidMount() {
    this.updateMenu(this.props)
  }

  render() {
    const {day} = this.props
    const {courses, loading} = this.state
    return (
      <div className={css.container}>
        <DaySelector
          onChange={this.onDayChange}
          dayOffset={day.startOf('day').diff(moment().startOf('day'), 'days')} />
        <Collapse isOpened>
          <CourseList
            className={classnames(css.courseList, loading && css.coursesLoading)}
            courses={courses} />
        </Collapse>
      </div>
    )
  }
}