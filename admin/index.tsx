import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { withRouter, BrowserRouter, Switch, Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import http from '../src/utils/http';
import DataTable from './DataTable';
import models from './models';
import toaster from './toaster';

const BaseView = withRouter(
  class extends React.PureComponent {
    state: {
      updatingRestaurants?: boolean;
    } = {};

    props: RouteComponentProps<any>;

    updateMenus = async () => {
      this.setState({ updatingRestaurants: true });
      await http.post('/admin/update-restaurants');
      this.setState({ updatingRestaurants: false });
    };

    checkAuth = async () => {
      try {
        await http.get('/admin/logged-in', true);
        if (!this.props.location.pathname.includes('/model/')) {
          this.props.history.replace('/admin/model/areas');
        }
      } catch (e) {
        this.props.history.replace('/admin/login');
      }
    };

    componentDidMount() {
      this.checkAuth();
    }

    login = async e => {
      e.preventDefault();
      const password = e.target.elements[0].value;
      try {
        await http.post('/admin/login', { password });
        toaster.clear();
        this.checkAuth();
      } catch (e) {
        toaster.show({ message: e.message, intent: Intent.DANGER });
      }
    };

    logout = async () => {
      await http.post('/admin/logout');
      this.checkAuth();
      toaster.show({ message: 'Goodbye!', intent: Intent.SUCCESS });
    };

    tabChange = (event, value) => {
      this.props.history.push('/admin/model/' + value);
    };

    renderModel = ({ match }) => {
      const model = models.find(model => model.key === match.params.model);

      return (
        <React.Fragment>
          <Tabs value={model ? model.key : 'none'} onChange={this.tabChange}>
            {models.map(m => <Tab key={m.key} value={m.key} label={m.name} />)}
          </Tabs>
          <div
            style={{ position: 'absolute', top: 0, right: 0, padding: '0.5em' }}
          >
            <Button
              color="primary"
              disabled={this.state.updatingRestaurants}
              onClick={this.updateMenus.bind(this)}
            >
              {this.state.updatingRestaurants ? 'Updating...' : 'Update menus'}
            </Button>
            <Button color="secondary" onClick={this.logout}>
              Log out
            </Button>
          </div>
          {model ? (
            <DataTable model={model} />
          ) : (
            <Paper>No such model "{match.params.model}".</Paper>
          )}
        </React.Fragment>
      );
    };

    render() {
      return (
        <Switch>
          <Route path="/admin/login">
            <form
              onSubmit={this.login}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translateY(-50%) translateX(-50%)'
              }}
            >
              <TextField
                type="password"
                label="Password"
                autoComplete="current-password"
                margin="normal"
              />
              &nbsp;
              <Button variant="raised" type="submit" color="primary">
                Log in
              </Button>
            </form>
          </Route>
          <Route path="/admin/model/:model" component={this.renderModel} />
        </Switch>
      );
    }
  }
);

ReactDOM.render(
  <BrowserRouter>
    <BaseView />
  </BrowserRouter>,
  document.querySelector('.container')
);
