import { isProduction } from '../utils/consts';

if ('serviceWorker' in navigator && isProduction) {
  (async () => {
    await navigator.serviceWorker.register('/worker.js');
  })();
}
