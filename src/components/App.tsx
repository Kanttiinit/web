import { Route, Routes, useLocation, useNavigate } from '@solidjs/router';
import { createEffect, createSignal, lazy, onCleanup, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { computedState, getDisplayedDays, setState, state } from '../state';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import parse from 'date-fns/parse';
import isSameDay from 'date-fns/isSameDay';

import ChangeLog from './ChangeLog';
import Clients from './Clients';
import Contact from './Contact';
import Footer from './Footer';
import Modal from './Modal';
import NotFound from './NotFound';
import RestaurantList from './RestaurantList';
const RestaurantModal = lazy(() => import('./RestaurantModal'));
import Settings from './Settings';
import TermsOfService from './TermsOfService';
import TopBar from './TopBar';
import { getNewPath, isDateInRange } from '../utils';
import haversine from 'haversine';
const ReportModal = lazy(() => import('./ReportModal'));

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  createEffect(() => {
    if (computedState.darkMode()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });

  createEffect(() => {
    const isDev =
      // @ts-ignore
      !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
      // @ts-ignore
      !!window.__REDUX_DEVTOOLS_EXTENSION__ ||
      // @ts-ignore
      !!window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
      // @ts-ignore
      !!window.__VUE_DEVTOOLS_GLOBAL_HOOK__ ||
      // @ts-ignore
      !!window.__SVELTE_DEVTOOLS_HOOK__ ||
      // @ts-ignore
      typeof window.ng !== 'undefined';

    if (isDev) {
      // check if it is april fools day
      const now = new Date();
      const isAprilFools =
        now.getDate() === 1 &&
        now.getMonth() === 3 &&
        now.getFullYear() === 2025;
      if (
        (isAprilFools && localStorage.getItem('isSurprise') !== 'false') ||
        localStorage.getItem('forceSurprise') === 'true'
      ) {
        localStorage.setItem('isSurprise', 'true');
      }
    }
  });

  createEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(state.preferences));
  });

  createEffect(() => {
    const day = new URL('http://dummy.com' + location.search).searchParams.get(
      'day'
    );
    setState(
      'selectedDay',
      day
        ? startOfDay(parse(day, 'y-MM-dd', new Date()))
        : startOfDay(new Date())
    );
  });

  const [locationWatchId, setLocationWatchId] = createSignal<number | null>(
    null
  );
  createEffect(() => {
    // start or stop watching for location
    if (state.preferences.useLocation && !locationWatchId()) {
      setLocationWatchId(
        navigator.geolocation.watchPosition(
          ({ coords }) => {
            setState('location', currentLocation => {
              if (!currentLocation) {
                return coords;
              }
              const distance = haversine(currentLocation, coords, {
                unit: 'meter'
              });
              if (distance > 100) {
                return coords;
              }
              return currentLocation;
            });
          },
          error => {
            switch (error.code) {
              case 1:
                state.preferences.useLocation = false;
            }
          }
        )
      );
    } else if (!state.preferences.useLocation && locationWatchId()) {
      navigator.geolocation.clearWatch(locationWatchId()!);
      setLocationWatchId(null);
      state.location = null;
    }

    if (!state.preferences.useLocation) {
      setState({ location: undefined });
    }
  });

  const update = async () => {
    // update displayed days if first day is in past
    if (
      state.displayedDays.length &&
      !isSameDay(new Date(), state.displayedDays[0])
    ) {
      setState('displayedDays', getDisplayedDays());
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLElement && e.target.tagName !== 'INPUT') {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const offset = e.key === 'ArrowLeft' ? -1 : 1;
        const newDay = addDays(state.selectedDay, offset);
        if (isDateInRange(newDay)) {
          navigate(getNewPath(newDay), { replace: true });
        }
      }
    }
  };

  onMount(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('focus', update);
  });

  onCleanup(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('focus', update);
  });

  return (
    <>
      <Container>
        <div>
          <TopBar />
          <RestaurantList />
        </div>
        <Footer />
      </Container>
      <Modal>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/settings" component={Settings} />
          <Route path="/contact" component={Contact} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/clients" component={Clients} />
          <Route path="/news" component={ChangeLog} />
          <Route path="/restaurant/:id" component={RestaurantModal} />
          <Route path="/report/:id" component={ReportModal} />
          <Route path="*" component={NotFound} />
        </Routes>
      </Modal>
    </>
  );
}
