import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Tab, Tabs, Button, InputGroup, ControlGroup, ButtonGroup, Intent, Callout } from '@blueprintjs/core'
import { withRouter, Link, BrowserRouter, Switch, Route } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
require('@blueprintjs/core/lib/css/blueprint.css')

import http from '../src/utils/http'
import AdminInterface from './AdminInterface'
import models, { Model } from './models'
import toaster from './toaster'

const BaseView = withRouter(class extends React.PureComponent {
  state: {
    updatingRestaurants?: boolean
  } = {};

  props: RouteComponentProps<any>

  updateMenus = async () => {
    this.setState({updatingRestaurants: true})
    await http.post('/admin/update-restaurants')
    this.setState({updatingRestaurants: false})
  }

  checkAuth = async () => {
    try {
      await http.get('/admin/logged-in', true)
      if (!this.props.location.pathname.includes('/model/')) {
        this.props.history.replace('/admin/model/areas')
      }
    } catch (e) {
      this.props.history.replace('/admin/login')
    }
  }

  componentDidMount() {
    this.checkAuth()
  }

  login = async (e) => {
    e.preventDefault()
    const password = e.target.elements[0].value
    try {
      await http.post('/admin/login', {password})
      toaster.clear()
      this.checkAuth()
    } catch (e) {
      toaster.show({message: e.message, intent: Intent.DANGER})
    }
  }

  logout = async () => {
    await http.post('/admin/logout')
    this.checkAuth()
    toaster.show({message: 'Goodbye!', intent: Intent.SUCCESS})
  }

  renderModel = ({match}) => {
    const model = models.find(model => model.key === match.params.model)

    return (
      <React.Fragment>
        <Tabs selectedTabId={model ? model.key : 'none'} id="nav">
          {models.map(m =>
            <Tab key={m.key} id={m.key}>
              <Link to={`/admin/model/${m.key}`}>{m.name}</Link>
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
        {model
          ? <AdminInterface model={model} />
          : <Callout intent={Intent.WARNING}>No such model "{match.params.model}".</Callout>
        }
      </React.Fragment>
    )
  }

  render() {
    return (
      <Switch>
        <Route path="/admin/login">
          <form onSubmit={this.login} style={{position: 'absolute', top: '50%', left: '50%', transform: 'translateY(-50%) translateX(-50%)'}}>
            <ControlGroup>
              <InputGroup type="password" placeholder="Password" />
              <Button type="submit" intent={Intent.PRIMARY}>Log in</Button>
            </ControlGroup>
          </form>
        </Route>
        <Route path="/admin/model/:model" component={this.renderModel} />
      </Switch>
    )
  }
})

ReactDOM.render(<BrowserRouter><BaseView /></BrowserRouter>, document.querySelector('.container'))
