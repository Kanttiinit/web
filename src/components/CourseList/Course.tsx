import * as React from 'react';
import { MdFavorite } from 'react-icons/md';
import styled, { css } from 'styled-components';
import { propertyContext } from '../../contexts';
import { CourseType } from '../../contexts/types';
import { useIsFavorite } from '../../utils/hooks';
import Property from './Property';

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

const Course = ({ course }: { course: CourseType }) => {
  const isFavoriteFn = useIsFavorite();
  const { isDesiredProperty, isUndesiredProperty } = React.useContext(
    propertyContext
  );
  const isFavorite = isFavoriteFn(course);

  const highlight = course.properties.some(isDesiredProperty);

  const dim = course.properties.some(isUndesiredProperty);

  return (
    <CourseWrapper favorite={isFavorite}>
      {isFavorite && <FavoriteIcon />}
      <CourseTitle highlight={highlight} dimmed={dim}>
        {course.title}
      </CourseTitle>
      <PropertyContainer>
        {course.properties.map(p => (
          <Property
            key={p}
            highlighted={isDesiredProperty(p)}
            dimmed={isUndesiredProperty(p)}
            property={p}
          />
        ))}
      </PropertyContainer>
    </CourseWrapper>
  );
};

export default Course;
