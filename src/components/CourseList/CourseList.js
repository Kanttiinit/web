// @flow
import React from 'react'
import Heart from 'react-icons/lib/io/heart'
import c from 'classnames'
import memoize from 'lodash/memoize'
import groupBy from 'lodash/groupBy'
import values from 'lodash/values'
import mapValues from 'lodash/mapValues'
import capitalize from 'lodash/capitalize'

import type {CourseType} from '../../store/types'
import Text from '../Text'
import css from './CourseList.scss'

const prefixer = (title: string) => {
  const split = title.split(':', 2)
  return split.length > 1 ? split[0] : ''
}

const courseGroups = (courses: Array<CourseType>) => {
  const grouped = groupBy(courses, c => prefixer(c.title))
  return values(mapValues(grouped, (group, groupKey) => ({
    key: groupKey,
    courses: group.map(c => ({ ...c, title: c.title.replace(groupKey + ': ', '') }))
  })))
}

const moizedGroups = memoize(courseGroups)

const Course = ({course}: {course: CourseType}) => (
  <div
    className={c(css.course, course.isFavorite && css.favoriteCourse, course.matchesSpecialDiet && css.specialDiet)}>
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
        {moizedGroups(courses).map(group => (
          <div key={group.key} className={css.courseGroup}>
            <span className={css.courseGroupTitle}>{ capitalize(group.key) }</span>
            {group.courses.map((c, i) => <Course key={i} course={c} />)}
          </div>
        ))}
      </div>
    )
  }
}