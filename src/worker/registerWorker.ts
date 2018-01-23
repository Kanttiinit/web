if ('serviceWorker' in navigator) {
  (async () => {
    await navigator.serviceWorker.register('/worker.js')
  })()
}
