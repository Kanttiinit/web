import * as React from 'react';
import Progress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import * as sortBy from 'lodash/fp/sortBy';
import { RestaurantType, Lang } from '../src/store/types';
import * as api from '../src/utils/api';
import http from '../src/utils/http';
import { Route, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';
import * as groupBy from 'lodash/fp/groupBy';
import * as moment from 'moment';

import OpeningHoursEditor from './OpeningHoursEditor';

type ListState = {
  openingHours?: Array<any>;
  loading: boolean;
  modalOpen: boolean;
  modalMode: 'create' | 'edit';
  modalItem?: any;
};

const styles = theme => ({
  gridContainer: {
    marginTop: theme.spacing.unit
  }
});

const OpeningHoursList = withStyles(styles)(
  class extends React.PureComponent<any, ListState> {
    state: ListState = {
      loading: false,
      modalOpen: false,
      modalMode: 'create'
    };

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

    openCreateModal = () => {
      this.setState({ modalOpen: true, modalMode: 'create' });
    };

    closeModal = () => this.setState({ modalOpen: false });

    handleModalAction = async (item: any) => {
      if (item) {
        if (this.state.modalMode === 'create') {
          await http.post('/admin/openinghours', {
            ...item,
            RestaurantId: this.props.restaurantId
          });
          await this.fetchOpeningHours();
        }
      }
      this.closeModal();
    };

    editItem = item => {
      this.setState({ modalOpen: true, modalMode: 'edit', modalItem: item });
    };

    deleteItem = async id => {
      if (confirm('Are you sure?')) {
        await http.delete(`/admin/openinghours/${id}`);
        await this.fetchOpeningHours();
      }
    };

    renderGridItem = (day: number, item: any) => {
      return (
        <Grid md key={day} item>
          <Card>
            <CardContent>
              <Typography variant="body2">
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
                From: {item.from}
                <br />To: {item.to || 'forever'}
              </Typography>
            </CardContent>
            {item.manualEntry && (
              <CardActions>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => this.deleteItem(item.id)}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => this.editItem(item)}
                >
                  Edit
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      );
    };

    render() {
      const {
        loading,
        openingHours,
        modalOpen,
        modalMode,
        modalItem
      } = this.state;

      if (loading) {
        return <Progress />;
      }

      const { classes } = this.props;
      const groupedHours = groupBy('dayOfWeek', openingHours);
      let grid = [];
      for (let row = 0; row < 10000; row++) {
        let foundItems = 0;
        grid.push(
          <Grid
            className={classes.gridContainer}
            wrap="nowrap"
            key={row}
            container
            spacing={8}
          >
            {[0, 1, 2, 3, 4, 5, 6].map(day => {
              const item = groupedHours[day] && groupedHours[day][row];
              if (!item) {
                return <Grid item md key={day} />;
              }
              foundItems++;
              return this.renderGridItem(day, item);
            })}
          </Grid>
        );
        if (foundItems === 0) {
          break;
        }
      }

      return (
        <React.Fragment>
          <br />
          <br />
          <Button
            onClick={this.openCreateModal}
            variant="raised"
            color="primary"
          >
            Create new
          </Button>
          {grid}
          <Dialog
            fullWidth
            maxWidth="sm"
            onClose={this.closeModal}
            open={modalOpen}
          >
            <OpeningHoursEditor
              mode={modalMode}
              onAction={this.handleModalAction}
              item={modalItem}
            />
          </Dialog>
        </React.Fragment>
      );
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
