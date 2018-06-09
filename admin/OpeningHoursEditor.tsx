import * as React from 'react';
import Progress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import * as sortBy from 'lodash/fp/sortBy';
import { RestaurantType, Lang } from '../src/store/types';
import * as api from '../src/utils/api';
import http from '../src/utils/http';
import { Route, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';
import * as groupBy from 'lodash/fp/groupBy';
import * as moment from 'moment';

type ListState = {
  openingHours?: Array<any>;
  loading: boolean;
};

const styles = theme => ({
  gridItem: {
    padding: theme.spacing.unit
  },
  gridContainer: {
    marginTop: theme.spacing.unit
  }
});

const OpeningHoursList = withStyles(styles)(
  class extends React.PureComponent<any, ListState> {
    state: ListState = { loading: false };

    componentDidMount() {
      this.fetchOpeningHours();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.restaurantId !== this.props.restaurantId) {
        this.fetchOpeningHours();
      }
    }

    fetchOpeningHours = async () => {
      this.setState({ loading: true });
      this.setState({
        loading: false,
        openingHours: await http.get(
          `/admin/opening-hours/${this.props.restaurantId}`,
          true
        )
      });
    };

    renderGrid() {
      const { openingHours } = this.state;
      const { classes } = this.props;
      const groupedHours = groupBy('dayOfWeek', openingHours);
      let row = 0;
      let output = [];
      while (true) {
        let foundItems = 0;
        output.push(
          <Grid
            className={classes.gridContainer}
            key={row}
            container
            spacing={8}
          >
            {[0, 1, 2, 3, 4, 5, 6].map(day => {
              const item = groupedHours[day] && groupedHours[day][row];
              if (!item) {
                return null;
              }
              foundItems++;
              return (
                <Grid md key={day} item>
                  <Paper className={classes.gridItem} elevation={2}>
                    <Typography variant="subheading">
                      {moment(item.dayOfWeek + 1, 'E').format('ddd')}
                      &nbsp;
                      {item.closed ? (
                        'Closed'
                      ) : (
                        <span>
                          {item.opens} &ndash; {item.closes}
                        </span>
                      )}
                    </Typography>
                    <Typography color="textSecondary">
                      {item.from} &ndash; {item.to || 'forever'}
                    </Typography>
                    {item.manualEntry && (
                      <React.Fragment>
                        <Button variant="outlined" color="primary" size="small">
                          Edit
                        </Button>
                        &nbsp;
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                        >
                          Delete
                        </Button>
                      </React.Fragment>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        );
        if (foundItems === 0) {
          break;
        }
        row++;
      }
      return output;
    }

    render() {
      if (this.state.loading) {
        return <Progress />;
      }

      return this.renderGrid();
    }
  }
);

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
                  {sortBy('name', restaurants).map(restaurant => (
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
