import 'babel-core/register'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import http from '../src/utils/http'
import AdminInterface from './AdminInterface'
import models from './models'

class BaseView extends React.PureComponent {
  state = {};

  updateMenus = async () => {
    this.setState({updatingRestaurants: true})
    await http.post('/admin/update-restaurants')
    this.setState({updatingRestaurants: false})
  }

  changeModel = async (model = this.state.currentModel) => {
    try {
      const response = await http.get('/admin/' + model.name.toLowerCase(), true)
      this.setState({
        currentModel: model,
        items: response,
        unauthorized: false
      })
    } catch (e) {
      this.setState({unauthorized: true})
    }
  }

  componentDidMount() {
    this.changeModel(models[0])
  }

  login = async (e) => {
    e.preventDefault()
    const password = e.target.elements[0].value
    try {
      await http.post('/admin/login', {password})
      this.changeModel(models[0])
    } catch (e) {
      alert(e.message)
    }
  }

  logout = async () => {
    await http.post('/admin/logout')
    this.changeModel(models[0])
  }

  render() {
    const {currentModel, items, unauthorized} = this.state
    if (unauthorized) {
      return (
        <form className="form-inline" onSubmit={this.login}>
          <br />
          <input className="form-control" placeholder="Password" type="password" />
          &nbsp;
          <button className="btn btn-primary">Log in</button>
        </form>
      )
    }
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
          <button
            className="btn btn-primary btn-sm"
            disabled={this.state.updatingRestaurants}
            onClick={this.updateMenus.bind(this)}>
            {this.state.updatingRestaurants ? 'Updating...' : 'Update menus'}
          </button>
          &nbsp;
          <button
            className="btn btn-warning btn-sm"
            onClick={this.logout}>
            Log out
          </button>
        </div>
        <AdminInterface onUpdate={() => this.changeModel()} model={currentModel} items={items} />
      </div>
    )
  }
}

ReactDOM.render(<BaseView />, document.querySelector('.container'))
