import {version} from './consts'

let lastCheck = Math.round(Date.now() / 1000)
window.addEventListener('focus', async () => {
  const now = Math.round(Date.now() / 1000)
  if (!lastCheck || now - lastCheck > 3600) {
    lastCheck = now
    const response = await fetch(`/check-update?version=${version}`)
    const json = await response.json()
    if (json.updateAvailable) {
      window.location.reload()
    }
  }
})
