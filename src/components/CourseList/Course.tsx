import { For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { CourseType } from '../../types';
import { state } from '../../state';
import { isFavorite } from '../../utils';
import { HeartFilledIcon } from '../../icons';
import { properties } from '../../translations';
import Property from './Property';

const CourseTitle = styled.h2<{ highlight: boolean; dimmed: boolean }>`
  flex: 1;
  color: var(--gray1);
  margin: 0;
  font-size: inherit;
  font-weight: inherit;

  ${props =>
    props.highlight ?
    `
      color: var(--friendly);
      font-weight: 500;
    ` : ''}

  ${props => props.dimmed ? 'color: var(--gray4);' : ''}
`;

const PropertyContainer = styled.span`
  font-size: 0.7rem;
  font-weight: 300;
  display: inline;
  color: var(--gray2);
`;

const FavoriteIcon = styled(HeartFilledIcon)`
  margin-right: 0.5em;
`;

const CourseWrapper = styled.li<{
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

  ${props => props.favorite ? 'color: var(--hearty);' : ''}
`;

function getProperty(propertyKey: string) {
  return properties.find(p => p.key === propertyKey);
}

const isPropertySelected = (propertyKey: string) =>
  state.preferences.properties.some(p => p.toLowerCase() === propertyKey.toLowerCase());

function isDesiredProperty(propertyKey: string) {
  const property = getProperty(propertyKey);
  if (property && property.desired) {
    return isPropertySelected(propertyKey);
  }
  return false;
}

function isUndesiredProperty(propertyKey: string) {
  const property = getProperty(propertyKey);
  if (property && !property.desired) {
    return isPropertySelected(propertyKey);
  }
  return false;
}

const Course = (props: { course: CourseType }) => {
  const highlight = () => props.course.properties.some(isDesiredProperty);

  const dim = () => props.course.properties.some(isUndesiredProperty);

  const isFav = () => isFavorite(props.course);

  return (
    <CourseWrapper favorite={isFav()}>
      {isFav() && <FavoriteIcon />}
      <CourseTitle highlight={highlight()} dimmed={dim()}>
        {props.course.title}
      </CourseTitle>
      <PropertyContainer>
        <For each={props.course.properties}>
        {p =>
          <Property
            highlighted={isDesiredProperty(p)}
            dimmed={isUndesiredProperty(p)}
            property={p}
          />
        }
        </For>
      </PropertyContainer>
    </CourseWrapper>
  );
};

export default Course;
