import * as getIsoDay from 'date-fns/get_iso_day';
import * as isSameDay from 'date-fns/is_same_day';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  MdDirectionsBike,
  MdDirectionsWalk,
  MdFlag,
  MdMoreVert,
  MdPlace,
  MdStar
} from 'react-icons/md';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { preferenceStore, uiState } from '../../store';
import { RestaurantType } from '../../store/types';
import Colon from '../Colon';
import CourseList from '../CourseList';
import InlineIcon from '../InlineIcon';
import Text from '../Text';

const Distance = ({ distance }: { distance: number }) => {
  const kilometers = distance > 1500;
  return (
    <RestaurantMeta style={{ fontWeight: 400 }}>
      <InlineIcon>
        {!distance ? (
          <MdPlace />
        ) : kilometers ? (
          <MdDirectionsBike />
        ) : (
          <MdDirectionsWalk />
        )}
      </InlineIcon>
      {!distance ? (
        <Text id="locating" />
      ) : kilometers ? (
        parseFloat(String(distance / 1000)).toFixed(1)
      ) : (
        Math.round(distance)
      )}
      &nbsp;
      {distance && <Text id={kilometers ? 'kilometers' : 'meters'} />}
    </RestaurantMeta>
  );
};

export const Container = styled.div<{ noCourses?: boolean }>`
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

  @media (max-width: ${props => props.theme.breakSmall}) {
    width: initial;
    box-shadow: none;
    margin: 0.25rem 0;
    border-left: none;
    border-right: none;
    border-color: var(--gray5);
    border-radius: 0;
  }

  ${props => props.noCourses && 'opacity: 0.6;'}
`;

export const Header = styled.div`
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

  @media (max-width: ${props => props.theme.breakSmall}) {
    font-size: 1.1rem;
  }
`;

const RestaurantMeta = styled.div`
  color: var(--gray3);
  font-size: 0.8rem;
  font-weight: 600;

  @media (max-width: ${props => props.theme.breakSmall}) {
    font-size: 0.7rem;
  }
`;

const ActionsContainer = styled.div`
  color: var(--gray4);
  font-size: 0.75em;
  text-transform: uppercase;
  font-weight: 500;
  display: flex;
`;

const RightActions = styled.div`
  margin-left: auto;
`;

const actionLinkStyles = css`
  margin-right: 1ch;
  color: inherit;

  &:last-child {
    margin-right: 0;
  }

  &:hover,
  &:focus {
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
    color: ${props => props.color};
`;

export const courseListStyles = css`
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
  ${props => props.noCourses && 'var(--gray3)'}
`;

const ClosedText = styled(Text).attrs({
  element: 'small',
  id: 'restaurantClosed'
})`
  font-size: 0.8rem;
`;

type Props = RouteComponentProps<any> & {
  restaurant: RestaurantType;
};

export default withRouter(
  observer(
    class Restaurant extends React.Component<Props, {}> {
      toggleStar = () => {
        const { restaurant } = this.props;
        preferenceStore.setRestaurantStarred(
          restaurant.id,
          !restaurant.isStarred
        );
      }

      render() {
        const { restaurant } = this.props;
        const dayOfWeek = getIsoDay(uiState.selectedDay) - 1;
        const isClosed =
          isSameDay(uiState.selectedDay, new Date()) && !restaurant.isOpenNow;
        const { search } = this.props.location;
        return (
          <Container noCourses={restaurant.noCourses}>
            <Header>
              <RestaurantName
                noCourses={restaurant.noCourses}
                isClosed={isClosed}
              >
                {restaurant.name}
                {preferenceStore.useLocation && (
                  <Distance distance={restaurant.distance} />
                )}
              </RestaurantName>
              <RestaurantMeta>
                {restaurant.openingHours[dayOfWeek] && (
                  <React.Fragment>
                    <Colon>
                      {restaurant.openingHours[dayOfWeek].replace('-', '–')}
                    </Colon>
                    <br />
                  </React.Fragment>
                )}
                {isClosed && <ClosedText />}
              </RestaurantMeta>
            </Header>
            <StyledCourseList courses={restaurant.courses} />
            <ActionsContainer>
              <StyledActionLink
                to={{ pathname: `/report/${restaurant.id}`, search }}
              >
                <MdFlag size={18} />
              </StyledActionLink>
              <RightActions>
                <StyledNativeActionLink
                  onClick={this.toggleStar}
                  color={restaurant.isStarred ? '#FFA726' : undefined}
                >
                  <MdStar size={18} />
                </StyledNativeActionLink>
                &nbsp;
                <StyledActionLink
                  to={{ pathname: `/restaurant/${restaurant.id}`, search }}
                >
                  <MdMoreVert size={18} />
                </StyledActionLink>
              </RightActions>
            </ActionsContainer>
          </Container>
        );
      }
    }
  )
);
