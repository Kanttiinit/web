import { isProduction } from '../utils/consts';

if ('serviceWorker' in navigator && isProduction || true) {
  (async () => {
    await navigator.serviceWorker.register('/worker.js');
  })();
}
