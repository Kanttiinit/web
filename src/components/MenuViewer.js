// @flow
import React from 'react'
import moment from 'moment'

import DaySelector from './DaySelector'
import {getCourses} from '../utils/api'

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
      <div>
        <DaySelector
          onChange={this.onDayChange}
          dayOffset={day.startOf('day').diff(moment().startOf('day'), 'days')} />
        {loading ? <p>Loading...</p> : courses.map(course =>
          <div>{course.title}</div>
        )}
      </div>
    )
  }
}