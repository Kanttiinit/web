import { getISODay as getIsoDay, isSameDay } from 'date-fns';
import { createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakSmall } from '../../globalStyles';
import {
  BikeIcon,
  EditIcon,
  FilledStarIcon,
  LocationIcon,
  MoreIcon,
  WalkIcon,
} from '../../icons';
import { computedState, setState, state } from '../../state';
import type { RestaurantType } from '../../types';
import { getArrayWithToggled } from '../../utils';
import Colon from '../Colon';
import CourseList from '../CourseList';
import InlineIcon from '../InlineIcon';
import Link from '../Link';
import PriceCategoryBadge from '../PriceCategoryBadge';

const Distance = (props: { distance?: number }) => {
  const kilometers = () => (props.distance || 0) > 1500;
  return (
    <RestaurantMeta
      style={{
        'font-weight': 400,
        'text-align': 'left',
        display: 'inline-block',
      }}
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
        ? computedState.translations().locating
        : kilometers()
          ? parseFloat(String(props.distance / 1000)).toFixed(1)
          : Math.round(props.distance)}
      &nbsp;
      {props.distance &&
        (kilometers()
          ? computedState.translations().kilometers
          : computedState.translations().meters)}
    </RestaurantMeta>
  );
};

export const Container = styled.article<{ noCourses?: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: var(--gray7);
  padding: 1.2rem;
  border-radius: 8px;
  border: solid 1px var(--gray5);
  box-shadow: 0px 1px 2px 0px rgba(50, 50, 50, 0.1);
  box-sizing: border-box;
  width: calc(25% - 0.5rem);
  margin: 0.25rem;

  &.disappear {
    animation: snapFade 2s forwards;
    overflow: hidden;
  }

  @media (max-width: 1111px) {
    width: calc(33.3% - 0.5rem);∫
  }

  &.disappear::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background: repeating-radial-gradient(
      circle,
      rgba(255, 255, 255, 0.6) 0px,
      rgba(255, 255, 255, 0.3) 2px,
      transparent 4px
    );
    pointer-events: none;
    animation: snapDust 2s forwards;
    mix-blend-mode: lighten;
    opacity: 0.5;
  }

  @keyframes snapFade {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    60% {
      transform: translateY(-10px) scale(1.05);
      opacity: 0.7;
    }
    100% {
      transform: translateY(-50px) scale(0.9);
      opacity: 0;
    }
  }

  @keyframes snapDust {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 0.5;
    }
    50% {
      transform: translate(10px, -20px) rotate(15deg);
      opacity: 0.3;
    }
    100% {
      transform: translate(-30px, -80px) rotate(-25deg);
      opacity: 0;
    }
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

  ${props => (props.noCourses ? 'opacity: 0.6;' : '')}
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
  ${props => (props.noCourses ? 'var(--gray3)' : '')}
`;

const ClosedText = styled.small`
  font-size: 0.8rem;
  margin-left: auto;
`;

interface Props {
  restaurant: RestaurantType;
  onShowMakeItStaph?: () => void;
}

const Restaurant = (props: Props) => {
  const dayOfWeek = () => getIsoDay(state.selectedDay) - 1;
  const isClosed = () =>
    isSameDay(state.selectedDay, new Date()) && !props.restaurant.isOpenNow;

  const toggleStar = () => {
    setState(
      'preferences',
      'starredRestaurants',
      getArrayWithToggled(
        state.preferences.starredRestaurants,
        props.restaurant.id,
      ),
    );
  };

  const [hovering, setHovering] = createSignal(false);
  function deploySurprise() {
    if (localStorage.getItem('isSurprise') === 'true') {
      setHovering(true);
      setTimeout(() => {
        if (localStorage.getItem('isSurprise') === 'true') {
          props.onShowMakeItStaph?.();
        }
      }, 2000);
    }
  }

  return (
    <Container
      classList={{ disappear: hovering() }}
      noCourses={props.restaurant.noCourses}
      onMouseEnter={deploySurprise}
    >
      <Link to={`/restaurant/${props.restaurant.id}`}>
        <Header>
          <RestaurantName
            noCourses={props.restaurant.noCourses}
            isClosed={isClosed()}
          >
            {props.restaurant.name}
            <div>
              {state.preferences.useLocation && (
                <>
                  <Distance distance={props.restaurant.distance} />
                  &nbsp;&nbsp;
                </>
              )}
              <PriceCategoryBadge
                priceCategory={props.restaurant.priceCategory}
              />
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
              <ClosedText>
                {computedState.translations().restaurantClosed}
              </ClosedText>
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
            color={props.restaurant.isStarred ? 'var(--star)' : ''}
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
