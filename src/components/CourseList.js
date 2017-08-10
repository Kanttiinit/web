// @flow
import React from 'react'
import Heart from 'react-icons/lib/io/heart'
import c from 'classnames'

import type {CourseType} from '../store/types'
import Text from './Text'
import css from '../styles/CourseList.scss'

export default class CourseList extends React.PureComponent {
  props: {
    courses: Array<CourseType>
  }

  render() {
    const {courses, ...props} = this.props

    return (
      <div {...props}>
        {!courses.length && <Text id="noMenu" element="span" className={css.emptyText} />}
        {courses.map((course, i) => 
          <div
            className={c(css.course, course.isFavorite && css.favoriteCourse)}
            key={i}>
            {course.isFavorite && <Heart className={`inline-icon ${css.icon}`} />}
            <span className={css.title}>{course.title}</span>
            <span className={css.props}>{course.properties.join(' ')}</span>
          </div>
        )}
      </div>
    )
  }
}