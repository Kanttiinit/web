import { createMemo, For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { computedState } from '../../state';
import type { CourseType } from '../../types';
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

interface Props {
  courses: CourseType[];
  class?: string;
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
  color: var(--text-secondary);
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

const capitalize = (string: string) => {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : '';
};

const CourseList = (props: Props) => {
  const courseGroups = createMemo(() => {
    const groups = props.courses.reduce(
      (g, course) => {
        const group = getCourseGroup(course);
        if (group in g) {
          g[group].push(course);
        } else {
          g[group] = [course];
        }
        return g;
      },
      {} as { [key: string]: CourseType[] },
    );

    return Object.keys(groups).map(groupKey => ({
      courses: groups[groupKey]
        .filter(c => !!c.title)
        .map(c => ({
          ...c,
          title: c.title.replace(`${groupKey}: `, ''),
        })),
      key: groupKey,
    }));
  });

  return (
    <Container {...props}>
      {!props.courses.length && (
        <EmptyText>{computedState.translations().noMenu}</EmptyText>
      )}
      <For each={courseGroups()}>
        {(group: CourseGroup) => (
          <Group>
            <GroupTitle>{capitalize(group.key)}</GroupTitle>
            <For each={group.courses}>{c => <Course course={c} />}</For>
          </Group>
        )}
      </For>
    </Container>
  );
};

export default CourseList;
