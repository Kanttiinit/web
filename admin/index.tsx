import * as React from 'react'
import * as ReactDOM from 'react-dom'
import http from '../src/utils/http'
import AdminInterface from './AdminInterface'
import models, { Model } from './models'
import { Tab, Tabs, Button, InputGroup, ControlGroup, ButtonGroup, Intent } from '@blueprintjs/core'
require('@blueprintjs/core/lib/css/blueprint.css')

class BaseView extends React.PureComponent {
  state: {
    currentModel?: Model,
    items?: Array<any>,
    unauthorized?: boolean,
    updatingRestaurants?: boolean
  } = {};

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
        <form onSubmit={this.login}>
          <ControlGroup>
            <InputGroup type="password" placeholder="Password" />
            <Button intent={Intent.PRIMARY}>Log in</Button>
          </ControlGroup>
        </form>
      )
    }
    return (
      <React.Fragment>
        <Tabs id="nav">
          {models.map(m =>
            <Tab key={m.name} id={m.name}>
              <a href="#" onClick={this.changeModel.bind(this, m)}>{m.name}</a>
            </Tab>
          )}
        </Tabs>
        <ButtonGroup style={{position: 'absolute', top: 0, right: 0, padding: '0.5em'}}>
          <Button
            intent={Intent.PRIMARY}
            disabled={this.state.updatingRestaurants}
            onClick={this.updateMenus.bind(this)}>
            {this.state.updatingRestaurants ? 'Updating...' : 'Update menus'}
          </Button>
          <Button intent={Intent.WARNING} onClick={this.logout}>
            Log out
          </Button>
        </ButtonGroup>
        <AdminInterface onUpdate={() => this.changeModel()} model={currentModel} items={items} />
      </React.Fragment>
    )
  }
}

ReactDOM.render(<BaseView />, document.querySelector('.container'))
