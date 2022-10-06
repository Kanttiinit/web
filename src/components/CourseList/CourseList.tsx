import * as capitalize from 'lodash/capitalize';
import memoize from 'lodash/memoize';
import * as React from 'react';
import styled from 'styled-components';

import { CourseType } from '../../contexts/types';
import { useTranslations } from '../../utils/hooks';
import Course from './Course';

interface CourseGroup {
  key: string;
  courses: CourseType[];
}

const getCourseGroup = (course: CourseType) => {
  if (!course.title) {
    return '';
  }
  const split = course.title.split(':');
  return split.length > 1 ? split[0] : '';
};

const courseGroups = (courses: CourseType[]) => {
  const groups = courses.reduce(
    (g, course) => {
      const group = getCourseGroup(course);
      if (group in g) {
        g[group].push(course);
      } else {
        g[group] = [course];
      }
      return g;
    },
    {} as { [key: string]: CourseType[] }
  );

  return Object.keys(groups).map(groupKey => ({
    courses: groups[groupKey]
      .filter(c => !!c.title)
      .map(c => ({
        ...c,
        title: c.title.replace(groupKey + ': ', '')
      })),
    key: groupKey
  }));
};

const moizedGroups: typeof courseGroups = memoize(courseGroups);

interface Props {
  courses: CourseType[];
  className?: string;
}

const Container = styled.ul`
  padding: 0;
  margin: 0;
`;

const Group = styled.ul`
  padding: 0;
  margin: 0;

  &:not(:last-child) {
    margin-bottom: 0.6rem;
  }
`;

const GroupTitle = styled.h1`
  display: block;
  color: var(--gray2);
  margin: 0 0 0.2rem 0;
  font-size: 0.8em;
  font-weight: 500;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CourseList = ({ courses, ...props }: Props) => {
  const translations = useTranslations();
  return (
    <Container {...props}>
      {!courses.length && <EmptyText>{translations.noMenu}</EmptyText>}
      {moizedGroups(courses).map((group: CourseGroup) => (
        <Group key={group.key}>
          <GroupTitle>{capitalize(group.key)}</GroupTitle>
          {group.courses.map((c, i) => (
            <Course key={i} course={c} />
          ))}
        </Group>
      ))}
    </Container>
  );
};

export default CourseList;
