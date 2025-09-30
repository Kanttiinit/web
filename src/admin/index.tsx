import {
  Route,
  Router,
  useLocation,
  useNavigate,
  useParams
} from '@solidjs/router';
import { onMount, Show, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { styled } from 'solid-styled-components';
import Button from '../components/Button';
import Input from '../components/Input';

import http from '../http';
import DataTable from './DataTable';
import models from './models';

export let showMessage: (message: string) => void;

const Container = styled.div`
  max-width: 60rem;
  margin: 1rem auto;
  padding: 0 1rem;
`;

const Tabs = styled.div`
  display: flex;
`;

const Tab = styled.button<{ selected: boolean }>`
  cursor: pointer;
  background: ${props => props.selected ? '#ccc' : '#eee'};
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  font-family: inherit;
`;

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
      setState({ message: (e as any).message, messageVisible: true });
    }
  };

  const logout = async () => {
    await http.post('/admin/logout');
    checkAuth();
    setState({ message: 'Goodbye!', messageVisible: true });
  };

  const tabChange = (value: string) => {
    navigate('/admin/model/' + value);
  };

  const showMessageInternal = (message: string) =>
    setState({ messageVisible: true, message });

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

  const Login = () => (
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
      <Button type="submit">
        Log in
      </Button>
    </form>
  );

  function Model() {
    const params = useParams();
    const model = () => models.find(m => m.key === params.model);

    return (
      <Container>
        <Tabs>
          <For each={models}>
            {m => (
              <Tab
                onClick={() => tabChange(m.key)}
                selected={m.key === model()?.key}
              >
                {m.name}
              </Tab>
            )}
          </For>
        </Tabs>
        <div
          style={{ position: 'absolute', top: 0, right: 0, padding: '0.5em' }}
        >
          <Button disabled={state.updatingRestaurants} onClick={updateMenus}>
            {state.updatingRestaurants ? 'Updating...' : 'Update menus'}
          </Button>
          {' '}
          <Button onClick={logout} secondary>
            Log out
          </Button>
        </div>
        <Show
          keyed
          when={model()}
          fallback={<p>No such model &quot;{params.model}&quot;.</p>}
        >
          {model => <DataTable model={model} />}
        </Show>
      </Container>
    );
  }

  return (
    <>
      <Router>
        <Route
          path="/login"
          component={Login}
        />
        <Route path="/model/:model" component={Model} />
      </Router>
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
