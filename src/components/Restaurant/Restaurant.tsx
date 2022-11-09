import getIsoDay from 'date-fns/getISODay';
import isSameDay from 'date-fns/isSameDay';
import { styled } from 'solid-styled-components';

import { RestaurantType } from '../../types';
import { breakSmall } from '../../globalStyles';
import { setState, state } from '../../state';
import { BikeIcon, EditIcon, FilledStarIcon, LocationIcon, MoreIcon, WalkIcon } from '../../utils/icons';
import Colon from '../Colon';
import CourseList from '../CourseList';
import InlineIcon from '../InlineIcon';
import Link from '../Link';
import PriceCategoryBadge from '../PriceCategoryBadge';
import { getArrayWithToggled } from '../../utils/hooks';

const Distance = (props: { distance?: number }) => {
  const kilometers = () => props.distance || 0 > 1500;
  return (
    <RestaurantMeta
      style={{ 'font-weight': 400, 'text-align': 'left', display: 'inline-block' }}
    >
      <InlineIcon>
        {!props.distance ? (
          <LocationIcon />
        ) : kilometers() ? (
          <BikeIcon />
        ) : (
          <WalkIcon />
        )}
      </InlineIcon>
      {!props.distance
        ? state.translations.locating
        : kilometers()
        ? parseFloat(String(props.distance / 1000)).toFixed(1)
        : Math.round(props.distance)}
      &nbsp;
      {props.distance && (kilometers() ? state.translations.kilometers : state.translations.meters)}
    </RestaurantMeta>
  );
};

export const Container = styled.article<{ noCourses?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  background-color: var(--gray7);
  border-radius: 4px;
  border: solid 1px var(--gray5);
  box-shadow: 0px 1px 2px 0px rgba(50, 50, 50, 0.1);
  box-sizing: border-box;
  width: calc(25% - 0.5rem);
  margin: 0.25rem;

  @media (max-width: 1111px) {
    width: calc(33.3% - 0.5rem);
  }

  @media (max-width: ${breakSmall}) {
    width: initial;
    box-shadow: none;
    margin: 0.25rem 0;
    border-left: none;
    border-right: none;
    border-color: var(--gray5);
    border-radius: 0;
  }

  ${props => props.noCourses ? 'opacity: 0.6;' : ''}
`;

export const Header = styled.header`
  display: flex;
  margin-bottom: 1.4rem;
  justify-content: space-between;
  align-items: center;
`;

const RestaurantName = styled.h2<{ noCourses?: boolean; isClosed?: boolean }>`
  color: ${props =>
    props.isClosed
      ? 'var(--gray1)'
      : props.noCourses
      ? 'var(--gray3)'
      : 'var(--gray1)'};
  font-weight: 500;
  margin: 0;
  max-width: 60%;
  font-size: 1.2rem;

  @media (max-width: ${breakSmall}) {
    font-size: 1.1rem;
  }
`;

const RestaurantMeta = styled.section`
  color: var(--gray2);
  font-size: 0.8rem;
  font-weight: 500;
  text-align: right;

  @media (max-width: ${breakSmall}) {
    font-size: 0.7rem;
  }
`;

const ActionsContainer = styled.section`
  color: var(--gray4);
  font-size: 0.75em;
  text-transform: uppercase;
  font-weight: 500;
  display: flex;
`;

const RightActions = styled.div`
  margin-left: auto;
`;

const actionLinkStyles = `
  margin-right: 1ch;
  color: inherit;

  &:last-child {
    margin-right: 0;
  }

  &:hover,
  &:focus {
    outline: none;
    color: var(--accent_color);
  }
`;

const StyledActionLink = styled(Link)`
  && {
    ${actionLinkStyles}
  }
`;

const StyledNativeActionLink = styled.a<{ color: string }>`
    ${actionLinkStyles}
    color: ${props => props.color} !important;
`;

export const courseListStyles = `
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 5rem;
  font-size: 0.9em;
  color: var(--gray1);
  margin-bottom: 0.5rem;
`;

const StyledCourseList = styled(CourseList)<{ noCourses?: boolean }>`
  ${courseListStyles}
  ${props => props.noCourses ? 'var(--gray3)' : ''}
`;

const ClosedText = styled.small`
  font-size: 0.8rem;
  margin-left: auto;
`;

interface Props {
  restaurant: RestaurantType;
}

const Restaurant = (props: Props) => {
  const dayOfWeek = () => getIsoDay(state.selectedDay) - 1;
  const isClosed = () =>
    isSameDay(state.selectedDay, new Date()) && !props.restaurant.isOpenNow;

  const toggleStar = () => {
    setState('preferences', 'starredRestaurants', getArrayWithToggled(state.preferences.starredRestaurants, props.restaurant.id));
  };

  return (
    <Container noCourses={props.restaurant.noCourses}>
      <Link to={`/restaurant/${props.restaurant.id}`}>
        <Header>
          <RestaurantName noCourses={props.restaurant.noCourses} isClosed={isClosed()}>
            {props.restaurant.name}
            <div>
              {state.preferences.useLocation && (
                <>
                  <Distance distance={props.restaurant.distance} />
                  &nbsp;&nbsp;
                </>
              )}
              <PriceCategoryBadge priceCategory={props.restaurant.priceCategory} />
            </div>
          </RestaurantName>
          <RestaurantMeta>
            {props.restaurant.openingHours[dayOfWeek()] && (
              <>
                <Colon>
                  {props.restaurant.openingHours[dayOfWeek()].replace('-', '–')}
                </Colon>
                <br />
              </>
            )}
            {isClosed() && (
              <ClosedText>{state.translations.restaurantClosed}</ClosedText>
            )}
          </RestaurantMeta>
        </Header>
      </Link>
      <StyledCourseList courses={props.restaurant.courses} />
      <ActionsContainer>
        <StyledActionLink
          aria-label={`Fix information about ${props.restaurant.name}`}
          to={`/report/${props.restaurant.id}`}
        >
          <EditIcon size={18} />
        </StyledActionLink>
        <RightActions>
          <StyledNativeActionLink
            aria-label={
              props.restaurant.isStarred
                ? `Star ${props.restaurant.name}`
                : `Unstar ${props.restaurant.name}`
            }
            onClick={toggleStar}
            color={props.restaurant.isStarred ? '#FFA726' : ''}
            tabIndex={0}
          >
            <FilledStarIcon size={18} />
          </StyledNativeActionLink>
          &nbsp;
          <StyledActionLink
            aria-label={`More information about ${props.restaurant.name}`}
            to={`/restaurant/${props.restaurant.id}`}
          >
            <MoreIcon size={18} />
          </StyledActionLink>
        </RightActions>
      </ActionsContainer>
    </Container>
  );
};

export default Restaurant;
