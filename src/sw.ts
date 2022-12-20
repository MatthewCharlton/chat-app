self.addEventListener('install', () => {
  console.log('install');
});

self.addEventListener('fetch', () => {
  console.log('fetch');
});

self.addEventListener('push', (e) => {
  console.log('push', e);
});
