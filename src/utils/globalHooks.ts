import * as moment from 'moment'

import {uiState} from '../store'
import {version} from './consts'

let lastUpdateCheck = Math.round(Date.now() / 1000)

window.addEventListener('focus', async () => {
  // check for newer version and reload
  const now = Math.round(Date.now() / 1000)
  if (!lastUpdateCheck || now - lastUpdateCheck > 3600) {
    lastUpdateCheck = now
    const response = await fetch(`/check-update?version=${version}`)
    const json = await response.json()
    if (json.updateAvailable) {
      window.location.reload()
    }
  }

  // update displayed days if first day is in past
  if (uiState.displayedDays.length && !uiState.displayedDays[0].isSame(moment(), 'day')) {
    uiState.updateDisplayedDays()
  }
})
