// @flow
import React from 'react'
import Heart from 'react-icons/lib/io/heart'
import c from 'classnames'
import _ from 'lodash'

import type {CourseType} from '../store/types'
import Text from './Text'
import css from '../styles/CourseList.scss'

const prefixer = (title: string) => {
  const split = _.split(title, ':', 2)
  return split.length > 1 ? _.get(split, ['0'], '') : ''
}

const groupByPrefix = (courses: Array<CourseType>): Array<any> =>
  _.groupBy(courses, c => prefixer(c.title))

const courseGroups = (courses: Array<CourseType>) => 
  _.values(_.mapValues(groupByPrefix(courses), (group, groupKey) => ({
    key: groupKey,
    courses: group.map(c => ({ ...c, title: c.title.replace(groupKey + ': ', '') }))
  })))

const Course = ({course}: {course: CourseType}) => (
  <div
    className={c(css.course, course.isFavorite && css.favoriteCourse)}>
    {course.isFavorite && <Heart className={`inline-icon ${css.icon}`} />}
    <span className={css.title}>{course.title}</span>
    <span className={css.props}>{course.properties.join(' ')}</span>
  </div>
)

export default class CourseList extends React.PureComponent {
  props: {
    courses: Array<CourseType>
  }

  render() {
    const {courses, ...props} = this.props

    return (
      <div {...props}>
        {!courses.length && <Text id="noMenu" element="span" className={css.emptyText} />}
        {courseGroups(courses).map(group => (
          <div className={css.courseGroup}>
            <span className={css.courseGroupTitle}>{ _.capitalize(group.key) }</span>
            {group.courses.map((c, i) => <Course key={i} course={c} />)}
          </div>
        ))}
      </div>
    )
  }
}