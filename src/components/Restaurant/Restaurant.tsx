import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import * as Walk from 'react-icons/lib/md/directions-walk';
import * as Bike from 'react-icons/lib/md/directions-bike';
import * as Location from 'react-icons/lib/io/pin';
import * as Star from 'react-icons/lib/md/star';
import * as More from 'react-icons/lib/md/more-vert';
import * as Flag from 'react-icons/lib/md/flag';
import * as c from 'classnames';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import * as moment from 'moment';

import Colon from '../Colon';
import CourseList from '../CourseList';
import { preferenceStore, uiState } from '../../store';
import Text from '../Text';
import * as css from './Restaurant.scss';
import { RestaurantType } from '../../store/types';

const Distance = ({ distance }: { distance: number }) => {
  const kilometers = distance > 1500;
  return (
    <div className={css.meta + ' ' + css.location}>
      {!distance ? (
        <Location className="inline-icon" />
      ) : kilometers ? (
        <Bike className="inline-icon" />
      ) : (
        <Walk className="inline-icon" />
      )}
      {!distance ? (
        <Text id="locating" />
      ) : kilometers ? (
        parseFloat(String(distance / 1000)).toFixed(1)
      ) : (
        Math.round(distance)
      )}
      &nbsp;
      {distance && <Text id={kilometers ? 'kilometers' : 'meters'} />}
    </div>
  );
};

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
      };

      render() {
        const { restaurant } = this.props;
        const dayOfWeek = uiState.selectedDay.isoWeekday() - 1;
        const isClosed =
          uiState.selectedDay.isSame(moment(), 'day') && !restaurant.isOpenNow;
        const { search } = this.props.location;
        const openingHour = restaurant.openingHours.find(
          hour => hour.daysOfWeek.indexOf(dayOfWeek) > -1
        );
        return (
          <div
            className={c(css.container, {
              [css.empty]: restaurant.noCourses,
              [css.shut]: isClosed
            })}
          >
            <div className={css.header}>
              <h2>
                {restaurant.name}
                {preferenceStore.useLocation && (
                  <Distance distance={restaurant.distance} />
                )}
              </h2>
              <div className={css.meta} style={{ textAlign: 'right' }}>
                {'closed' in openingHour ? null : (
                  <React.Fragment>
                    <Colon
                      text={openingHour.opens + '–' + openingHour.closes}
                    />
                    <br />
                  </React.Fragment>
                )}
                {isClosed && (
                  <Text
                    id="restaurantClosed"
                    className={css.closedText}
                    element="small"
                  />
                )}
              </div>
            </div>
            <CourseList className={css.body} courses={restaurant.courses} />
            <div className={css.restaurantActions}>
              <Link
                className={css.actionIcon}
                to={{ pathname: `/report/${restaurant.id}`, search }}
              >
                <Flag size={18} />
              </Link>
              <div style={{ marginLeft: 'auto' }}>
                <a
                  onClick={this.toggleStar}
                  style={{
                    color: restaurant.isStarred ? '#FFA726' : undefined
                  }}
                  className={css.actionIcon}
                >
                  <Star size={18} />
                </a>
                &nbsp;
                <Link
                  className={css.actionIcon}
                  to={{ pathname: `/restaurant/${restaurant.id}`, search }}
                >
                  <More size={18} />
                </Link>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
