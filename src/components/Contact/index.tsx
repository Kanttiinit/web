import * as React from 'react';
import Loadable from 'react-loadable';
import AssetsLoading from '../AssetsLoading';

export default Loadable({
  loader: () => import('./Contact'),
  loading: () => <AssetsLoading />
});
