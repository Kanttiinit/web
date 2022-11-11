import { Route, Routes, useLocation, useNavigate, useParams } from '@solidjs/router';
import { onMount, Show, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import Button from '../src/components/Button';
import Input from '../src/components/Input';

import http from '../src/http';
// import DataTable from './DataTable';
import models from './models';

export let showMessage: (message: string) => void;

export default function Admin() {
  const [state, setState] = createStore<{
    updatingRestaurants?: boolean;
    message?: string;
    messageVisible?: boolean;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (e: any) => {
    e.preventDefault();
    const password = e.target.elements[0].value;
    try {
      await http.post('/admin/login', { password });
      clearMessage();
      checkAuth();
    } catch (e) {
      setState({ message: e.message, messageVisible: true });
    }
  };

  const logout = async () => {
    await http.post('/admin/logout');
    checkAuth();
    setState({ message: 'Goodbye!', messageVisible: true });
  };

  const tabChange = (event: any, value: string) => {
    navigate('/admin/model/' + value);
  };

  const showMessageInternal = (message: string) => setState({ messageVisible: true, message });

  const updateMenus = async () => {
    setState({ updatingRestaurants: true });
    await http.post('/admin/update-restaurants');
    setState({ updatingRestaurants: false });
  };

  const checkAuth = async () => {
    try {
      await http.get('/admin/logged-in', true);
      if (!location.pathname.includes('/model/')) {
        navigate('/admin/model/areas', { replace: true });
      }
    } catch (e) {
      navigate('/admin/login', { replace: true });
    }
  };

  const clearMessage = () => setState({ messageVisible: false });

  onMount(() => {
    showMessage = showMessageInternal;
    checkAuth();
  });

  function Model() {
    const params = useParams();
    const model = () => models.find(m => m.key === params.model);
  
    return (
      <>
        <Tabs value={model() ? model()?.key : 'none'} onChange={tabChange}>
          <For each={models}>{m => (
            <Tab key={m.key} value={m.key} label={m.name} />
          )}</For>
        </Tabs>
        <div
          style={{ position: 'absolute', top: 0, right: 0, padding: '0.5em' }}
        >
          <Button
            disabled={state.updatingRestaurants}
            onClick={updateMenus}
          >
            {state.updatingRestaurants ? 'Updating...' : 'Update menus'}
          </Button>
          <Button color="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
        <Show keyed when={model()} fallback={<Paper>No such model &quot;{params.model}&quot;.</Paper>}>
          {model => <DataTable model={model} />}
        </Show>
      </>
    );
  }  

  return (
    <>
      <Routes>
        <Route path="/login" element={
          <form
            onSubmit={login}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateY(-50%) translateX(-50%)'
            }}
          >
            <Input
              type="password"
              label="Password"
              autoComplete="current-password"
            />
            &nbsp;
            <Button type="submit" color="primary">
              Log in
            </Button>
          </form>} />
        <Route path="/model/:model" component={Model} />
      </Routes>
      {/* <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={this.clearMessage}
        message={<span>{message}</span>}
        open={messageVisible}
      /> */}
    </>
  );
}
