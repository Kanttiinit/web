import * as React from 'react';
import Progress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import * as sortBy from 'lodash/fp/sortBy';
import { RestaurantType, Lang } from '../src/store/types';
import * as api from '../src/utils/api';
import http from '../src/utils/http';
import { Route, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';
import * as groupBy from 'lodash/fp/groupBy';
import * as moment from 'moment';

import OpeningHoursEditor from './OpeningHoursEditor';
import { showMessage } from '.';

type ListState = {
  openingHours?: Array<any>;
  loading: boolean;
  modalOpen: boolean;
  modalMode: 'create' | 'edit';
  modalItem?: any;
};

const days = [0, 1, 2, 3, 4, 5, 6];

class OpeningHoursList extends React.PureComponent<any, ListState> {
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
      try {
        if (this.state.modalMode === 'create') {
          await http.post('/admin/openinghours', {
            ...item,
            RestaurantId: this.props.restaurantId
          });
        } else {
          await http.put(`/admin/openinghours/${item.id}`, item);
        }
        this.closeModal();
        await this.fetchOpeningHours();
      } catch (e) {
        showMessage(e.message);
      }
    } else {
      this.closeModal();
    }
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
      <TableCell padding="none" key={day}>
        <Typography variant="body2">
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
        {item.manualEntry && (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </TableCell>
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

    const groupedHours = groupBy('dayOfWeek', openingHours);
    let rows = [];
    for (let row = 0; row < 100; row++) {
      let foundItems = 0;
      const rowContent = (
        <TableRow key={row}>
          {days.map(day => {
            const item = groupedHours[day] && groupedHours[day][row];
            if (!item) {
              return <TableCell padding="none" key={day} />;
            }
            foundItems++;
            return this.renderGridItem(day, item);
          })}
        </TableRow>
      );
      if (foundItems === 0) {
        break;
      } else {
        rows.push(rowContent);
      }
    }

    return (
      <React.Fragment>
        <br />
        <br />
        <Button onClick={this.openCreateModal} variant="raised" color="primary">
          Create new
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              {days.map(d => (
                <TableCell padding="none" key={d}>
                  {moment(d + 1, 'E').format('ddd')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
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
