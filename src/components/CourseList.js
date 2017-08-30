// @flow
import React from 'react'
import Heart from 'react-icons/lib/io/heart'
import c from 'classnames'
import _ from 'lodash'
import moize from 'moize'

import type {CourseType} from '../store/types'
import Text from './Text'
import css from '../styles/CourseList.scss'

const prefixer = (title: string) => {
  const split = _.split(title, ':', 2)
  return split.length > 1 ? _.get(split, ['0'], '') : ''
}

const courseGroups = (courses: Array<CourseType>) => {
  const grouped = _.groupBy(courses, c => prefixer(c.title))
  return _.values(_.mapValues(grouped, (group, groupKey) => ({
    key: groupKey,
    courses: group.map(c => ({ ...c, title: c.title.replace(groupKey + ': ', '') }))
  })))
}

const moizedGroups = moize(courseGroups)

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
        {moizedGroups(courses).map(group => (
          <div className={css.courseGroup}>
            <span className={css.courseGroupTitle}>{ _.capitalize(group.key) }</span>
            {group.courses.map((c, i) => <Course key={i} course={c} />)}
          </div>
        ))}
      </div>
    )
  }
}