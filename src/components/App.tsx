import { Route, Routes } from '@solidjs/router';
import { createEffect, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { state } from '../state';

// import AreaSelector from './AreaSelector';
// import AssetsLoading from './AssetsLoading';
import ChangeLog from './ChangeLog';
import Clients from './Clients';
import Contact from './Contact';
// import FavoriteSelector from './FavoriteSelector';
import Footer from './Footer';
import Modal from './Modal';
import NotFound from './NotFound';
// import ReportModal from './ReportModal';
import RestaurantList from './RestaurantList';
// import RestaurantModal from './RestaurantModal';
import Settings from './Settings';
import TermsOfService from './TermsOfService';
import TopBar from './TopBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

export default function App() {

  createEffect(() => {
    if (state.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });

  createEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(state.preferences));
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
          {/* <Route path="/restaurant/:id">
            {({ match }: any) => (
              <RestaurantModal restaurantId={match.params.id} />
            )}
          </Route>
          <Route path="/report/:restaurantId">
            {({ match }: any) => (
              <ReportModal restaurantId={match.params.restaurantId} />
            )}
          </Route> */}
          <Route path="*" component={NotFound} />
        </Routes>
      </Modal>
    </>
  );
};
