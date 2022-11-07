import { Route, Routes } from '@solidjs/router';
import { createEffect, createSignal } from 'solid-js';
import { untrack } from 'solid-js/web';
import { styled } from 'solid-styled-components';
import { state } from '../state';

// import { DataContextProvider } from '../contexts';
// import {
//   preferenceContext,
//   PreferenceContextProvider,
//   PropertyContextProvider,
//   UIStateProvider
// } from '../contexts';
// import useSideEffects from '../utils/useSideEffects';
// import AreaSelector from './AreaSelector';
// import AssetsLoading from './AssetsLoading';
// import ChangeLog from './ChangeLog';
// import Clients from './Clients';
// import Contact from './Contact';
// import FavoriteSelector from './FavoriteSelector';
import Footer from './Footer';
// import Modal from './Modal';
// import NotFound from './NotFound';
// import ReportModal from './ReportModal';
// import RestaurantList from './RestaurantList';
// import RestaurantModal from './RestaurantModal';
// import Settings from './Settings';
// import TermsOfService from './TermsOfService';
import TopBar from './TopBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

export default function App() {
  return (
    <>
      <Container>
        <div>
          <TopBar />
          {/* <RestaurantList /> */}
        </div>
        <Footer />
      </Container>
      {/* <Modal>
        <React.Suspense fallback={<AssetsLoading />}>
          <Switch>
            <Route exact path="/" render={null} />
            <Route path="/settings/favorites">
              <FavoriteSelector />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/terms-of-service">
              <TermsOfService />
            </Route>
            <Route path="/select-area">
              <AreaSelector />
            </Route>
            <Route path="/clients">
              <Clients />
            </Route>
            <Route path="/news">
              <ChangeLog />
            </Route>
            <Route path="/restaurant/:id">
              {({ match }: any) => (
                <RestaurantModal restaurantId={match.params.id} />
              )}
            </Route>
            <Route path="/report/:restaurantId">
              {({ match }: any) => (
                <ReportModal restaurantId={match.params.restaurantId} />
              )}
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </React.Suspense>
      </Modal> */}
    </>
  );
};
