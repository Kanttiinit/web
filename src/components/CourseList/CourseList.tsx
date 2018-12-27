import * as React from 'react';
import { MdFavorite } from 'react-icons/md';
import * as memoize from 'lodash/memoize';
import * as capitalize from 'lodash/capitalize';

import Property from './Property';
import { CourseType } from '../../store/types';
import Text from '../Text';
import { dataStore, preferenceStore } from '../../store';
import { observer } from 'mobx-react';
import styled, { css } from 'styled-components';

type CourseGroup = { key: string; courses: Array<CourseType> };

const getCourseGroup = (course: CourseType) => {
  const split = course.title.split(':');
  return split.length > 1 ? split[0] : '';
};

const courseGroups = (courses: Array<CourseType>) => {
  const groups = courses.reduce(
    (groups, course) => {
      const group = getCourseGroup(course);
      if (group in groups) {
        groups[group].push(course);
      } else {
        groups[group] = [course];
      }
      return groups;
    },
    {} as { [key: string]: Array<CourseType> }
  );

  return Object.keys(groups).map(groupKey => ({
    key: groupKey,
    courses: groups[groupKey].map(c => ({
      ...c,
      title: c.title.replace(groupKey + ': ', '')
    }))
  }));
};

const moizedGroups: typeof courseGroups = memoize(courseGroups);

const CourseTitle = styled.span<{ highlight: boolean; dimmed: boolean }>`
  flex: 1;
  color: var(--gray1);

  ${props =>
    props.highlight &&
    css`
      color: var(--friendly);
      font-weight: 500;
    `}

  ${props => props.dimmed && 'color: var(--gray4);'}
`;

const PropertyContainer = styled.span`
  font-size: 0.7rem;
  font-weight: 300;
  display: inline;
  color: var(--gray2);
`;

const FavoriteIcon = styled(MdFavorite)`
  margin-right: 0.5em;
`;

const CourseWrapper = styled.div<{
  favorite: boolean;
}>`
  padding-bottom: 0.2rem;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray6);
  }

  ${props => props.favorite && 'color: var(--hearty);'}
`;

const Course = observer(({ course }: { course: CourseType }) => {
  const isFavorite = dataStore.isFavorite(course);
  const highlight = course.properties.some(p =>
    preferenceStore.isDesiredProperty(p)
  );
  const dim = course.properties.some(p =>
    preferenceStore.isUndesiredProperty(p)
  );
  return (
    <CourseWrapper favorite={isFavorite}>
      {isFavorite && <FavoriteIcon />}
      <CourseTitle highlight={highlight} dimmed={dim}>
        {course.title}
      </CourseTitle>
      <PropertyContainer>
        {course.properties.map(p => (
          <Property key={p} property={p} />
        ))}
      </PropertyContainer>
    </CourseWrapper>
  );
});

interface Props {
  courses: Array<CourseType>;
  className?: string;
}

const Group = styled.div`
  &:not(:last-child) {
    margin-bottom: 0.6rem;
  }
`;

const GroupTitle = styled.span`
  display: block;
  color: var(--gray3);
  margin-bottom: 0.2rem;
  font-size: 0.8em;
`;

const EmptyText = styled(Text).attrs({ id: 'noMenu', element: 'span' })`
  font-size: 1rem;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CourseList = ({ courses, ...props }: Props) => (
  <div {...props}>
    {!courses.length && <EmptyText />}
    {moizedGroups(courses).map((group: CourseGroup) => (
      <Group key={group.key}>
        <GroupTitle>{capitalize(group.key)}</GroupTitle>
        {group.courses.map((c, i) => (
          <Course key={i} course={c} />
        ))}
      </Group>
    ))}
  </div>
);

export default CourseList;
