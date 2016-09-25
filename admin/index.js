import React from 'react';
import ReactDOM from 'react-dom';
import http from 'axios';
import AdminInterface from './AdminInterface';
import models from './models';

class BaseView extends React.Component {
  constructor() {
    super();
    this.state = {};
    const tokenMatch = location.href.match(/token\=([^&%#]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      this.state.token = token;
      http.defaults.headers.common['Authorization'] = token;
      this.changeModel(models[0]);
    }
  }
  updateMenus() {
    this.setState({updatingRestaurants: true});
    http.post('https://kitchen.kanttiinit.fi/admin/update-restaurants')
    .then(() => this.setState({updatingRestaurants: false}));
  }
  changeModel(model = this.state.currentModel) {
    http.get('https://kitchen.kanttiinit.fi/admin/' + model.name.toLowerCase())
    .then(response => {
      this.setState({
        currentModel: model,
        items: response.data
      });
    })
    .catch(() => this.setState({token: undefined}));
  }
  render() {
    const {currentModel, items, token} = this.state;
    if (!token)
      return (
        <form>
          <br /><input placeholder="Enter token" className="form-control" name="token" />
        </form>
      );
    return (
      <div>
        <br />
        <ul className="nav nav-tabs">
          {models.map(m =>
            <li key={m.name} className={m === currentModel ? 'active' : ''}>
            <a href="#" onClick={this.changeModel.bind(this, m)}>{m.name}</a>
            </li>
          )}
        </ul>
        <div style={{position: 'absolute', top: 0, right: 0, padding: '0.5em'}}>
          <button className="btn btn-primary btn-sm" disabled={this.state.updatingRestaurants} onClick={this.updateMenus.bind(this)}>{this.state.updatingRestaurants ? 'Updating...' : 'Update menus'}</button>
        </div>
        <AdminInterface onUpdate={() => this.changeModel()} model={currentModel} items={items} />
      </div>
    );
  }
}

ReactDOM.render(<BaseView />, document.querySelector('.container'));
