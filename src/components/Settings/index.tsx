import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./Settings'),
  loading: () => 'Loading...'
});
