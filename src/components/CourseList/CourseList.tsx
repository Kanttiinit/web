import * as React from 'react'
import * as Heart from 'react-icons/lib/io/heart'
import * as c from 'classnames'
import memoize = require('lodash/memoize')
import groupBy = require('lodash/groupBy')
import values = require('lodash/values')
import mapValues = require('lodash/mapValues')
import capitalize = require('lodash/capitalize')

import Property from './Property'
import {CourseType} from '../../store/types'
import Text from '../Text'
const css = require('./CourseList.scss')

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
    className={c(
      css.course,
      course.isFavorite && css.favoriteCourse,
      course.highlight && css.highlight,
      course.dim && css.dim
    )}>
    {course.isFavorite && <Heart className={`inline-icon ${css.icon}`} />}
    <span className={css.title}>{course.title}</span>
    <span className={css.props}>
      {course.properties.map(p => <Property key={p} property={p} />)}
    </span>
  </div>
)

export default class CourseList extends React.PureComponent {
  props: {
    courses: Array<CourseType>,
    className?: string
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