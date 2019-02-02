import { useEffect, useState } from 'react';

export default function usePolledResource<Resource>(
  fetch: () => Promise<Resource>,
  interval: number = 60 * 10
) {
  const [resource, setResource] = useState<Resource>(null);

  async function update() {
    setResource(await fetch());
  }

  useEffect(() => {
    update();
    const intervalId = setInterval(update, interval * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    window.addEventListener('focus', update);
    return () => window.removeEventListener('focus', update);
  }, []);

  return resource;
}
