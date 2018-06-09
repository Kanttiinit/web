import * as React from 'react';
import Progress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { sortBy } from 'lodash';
import { RestaurantType, Lang } from '../src/store/types';
import * as api from '../src/utils/api';
import { Route, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';

type ListProps = {
  restaurantId: number;
};

type ListState = {
  openingHours?: Array<any>;
  loading: boolean;
};

class OpeningHoursList extends React.PureComponent<ListProps, ListState> {
  state: ListState = { loading: false };

  componentDidMount() {
    this.fetchOpeningHours();
  }

  componentDidUpdate() {
    this.fetchOpeningHours();
  }

  fetchOpeningHours = async () => {
    this.setState({ loading: true });
    this.setState({ loading: false });
  };

  render() {
    const { loading, openingHours } = this.state;
    if (loading) {
      return <Progress />;
    }
    return null;
  }
}

type State = {
  restaurants?: Array<RestaurantType>;
};

export default withRouter(
  class OpeningHoursEditor extends React.PureComponent<
    RouteComponentProps<any>,
    State
  > {
    state: State = {};

    componentDidMount() {
      this.fetchRestaurants();
    }

    fetchRestaurants = async () => {
      this.setState({
        restaurants: await api.getRestaurantsByIds([], Lang.FI)
      });
    };

    selectRestaurant = e => {
      this.props.history.push(this.props.match.url + '/' + e.target.value);
    };

    render() {
      const { restaurants } = this.state;
      const { match } = this.props;

      if (!restaurants) {
        return <Progress />;
      }

      return (
        <Route path={match.path + '/:restaurantId'}>
          {({ match }) => (
            <React.Fragment>
              <FormControl fullWidth>
                <InputLabel htmlFor="select-restaurant">Restaurant</InputLabel>
                <Select
                  value={match ? Number(match.params.restaurantId) : ''}
                  onChange={this.selectRestaurant}
                  inputProps={{ id: 'select-restaurant' }}
                >
                  <MenuItem value="">None</MenuItem>
                  {sortBy(restaurants, 'name').map(restaurant => (
                    <MenuItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select restaurant to edit.</FormHelperText>
              </FormControl>
              {match && (
                <OpeningHoursList
                  restaurantId={Number(match.params.restaurantId)}
                />
              )}
            </React.Fragment>
          )}
        </Route>
      );
    }
  }
);
