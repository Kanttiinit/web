import * as isSameDay from 'date-fns/is_same_day';

import { uiState } from '../store';
import { version } from './consts';

let lastUpdateCheck = Math.round(Date.now() / 1000);

window.addEventListener('focus', async () => {
  // check for newer version and reload
  const now = Math.round(Date.now() / 1000);
  if (!lastUpdateCheck || now - lastUpdateCheck > 3600) {
    lastUpdateCheck = now;
    const response = await fetch(`/check-update?version=${version}`);
    const json = await response.json();
    if (json.updateAvailable) {
      window.location.reload();
    }
  }

  // update displayed days if first day is in past
  if (
    uiState.displayedDays.length &&
    !isSameDay(new Date(), uiState.displayedDays[0])
  ) {
    uiState.updateDisplayedDays();
  }
});
