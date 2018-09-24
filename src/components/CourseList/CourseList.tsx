import * as React from 'react';
import { MdFavorite } from 'react-icons/md';
import * as c from 'classnames';
import * as memoize from 'lodash/memoize';
import * as capitalize from 'lodash/capitalize';

import Property from './Property';
import { CourseType } from '../../store/types';
import Text from '../Text';
import * as css from './CourseList.scss';
import { dataStore, preferenceStore } from '../../store';
import { observer } from 'mobx-react';

const getCourseGroup = (course: CourseType) => {
  const split = course.title.split(':');
  return split.length > 1 ? split[0] : '';
};

const courseGroups = (courses: Array<CourseType>) => {
  const groups = courses.reduce((groups, course) => {
    const group = getCourseGroup(course);
    if (group in groups) {
      groups[group].push(course);
    } else {
      groups[group] = [course];
    }
    return groups;
  }, {});

  return Object.keys(groups).map(groupKey => ({
    key: groupKey,
    courses: groups[groupKey].map(c => ({
      ...c,
      title: c.title.replace(groupKey + ': ', '')
    }))
  }));
};

const moizedGroups = memoize(courseGroups);

const Course = observer(({ course }: { course: CourseType }) => {
  const isFavorite = dataStore.isFavorite(course);
  const highlight = course.properties.some(p =>
    preferenceStore.isDesiredProperty(p)
  );
  const dim = course.properties.some(p =>
    preferenceStore.isUndesiredProperty(p)
  );
  return (
    <div
      className={c(
        css.course,
        isFavorite && css.favoriteCourse,
        highlight && css.highlight,
        dim && css.dim
      )}
    >
      {isFavorite && <MdFavorite className={`inline-icon ${css.icon}`} />}
      <span className={css.title}>{course.title}</span>
      <span className={css.props}>
        {course.properties.map(p => (
          <Property key={p} property={p} />
        ))}
      </span>
    </div>
  );
});

interface Props {
  courses: Array<CourseType>;
  className?: string;
}

const CourseList = ({ courses, ...props }: Props) => (
  <div {...props}>
    {!courses.length && (
      <Text id="noMenu" element="span" className={css.emptyText} />
    )}
    {moizedGroups(courses).map(group => (
      <div key={group.key} className={css.courseGroup}>
        <span className={css.courseGroupTitle}>{capitalize(group.key)}</span>
        {group.courses.map((c, i) => (
          <Course key={i} course={c} />
        ))}
      </div>
    ))}
  </div>
);

export default CourseList;
