import { createSignal, Show } from 'solid-js';
import Button from '../Button';

import { supabase } from '../../providers/Supabase';
import urlBase64ToUint8Array from '../../utils/urlBase64ToUint8Array';
import getUserDataFromLocalStorage from '../../utils/getUserDataFromLocalStorage';

const publicVapidKey = import.meta.env.VITE_APP_VAPID_PUBLIC_KEY as string;

const DECLINE_PWA_INSTALL_LOCAL_STORAGE_KEY = 'murmur-pwa-install-decline';
const PERIODIC_SYNC_TAG_NAME = 'get-latest-messages';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(async (registration) => {
    const userData = getUserDataFromLocalStorage();
    const userEmail = userData?.currentSession?.user?.email;

    navigator.serviceWorker.ready.then((registration) => {
      // check push subscription
      registration.pushManager.getSubscription().then(async (subscription) => {
        if (subscription) return;

        const { data, error } = await supabase.from('push-subs').select();

        if (error || !data || data.length > 0) return;

        // register push
        const addSub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          // public vapid key
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await supabase
          .from('push-subs')
          .insert(
            [{ subscription: JSON.stringify(addSub), email: userEmail }],
            { returning: 'minimal' }
          );
      });
    });

    const status = await navigator.permissions.query({
      // @ts-ignore
      name: 'periodic-background-sync',
    });
    if (status.state === 'granted') {
      // Periodic background sync can be used.
      if ('periodicSync' in registration) {
        // @ts-ignore
        registration.periodicSync.getTags().then(async (tags) => {
          // navigator.serviceWorker.ready.then(registration => {
          //   registration.periodicSync.unregister(PERIODIC_SYNC_TAG_NAME);
          // });

          if (!tags.includes(PERIODIC_SYNC_TAG_NAME)) {
            try {
              // @ts-ignore
              await registration.periodicSync.register(PERIODIC_SYNC_TAG_NAME, {
                minInterval: 5 * 60 * 1000,
              });
            } catch {
              console.log('Periodic Sync could not be registered!');
            }
          }
        });
      }
    }
  });
}

const InstallPWA = () => {
  const [showInstallUI, toggleShowInstallUI] = createSignal(false);

  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();

    const lastDeclined = Number(
      window?.localStorage?.getItem(DECLINE_PWA_INSTALL_LOCAL_STORAGE_KEY)
    );
    if (lastDeclined && lastDeclined + 3 * 60 * 60 * 1000 > Date.now()) {
      return;
    }
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    setTimeout(() => toggleShowInstallUI(true), 1000);
  });

  const handleInstall = async () => {
    // Hide the app provided install promotion
    toggleShowInstallUI(false);
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
  };

  const handleDecline = () => {
    window?.localStorage?.setItem(
      DECLINE_PWA_INSTALL_LOCAL_STORAGE_KEY,
      Date.now().toString()
    );
    toggleShowInstallUI(false);
  };

  return (
    <Show when={showInstallUI()}>
      <div class="fixed bottom-5 mx-5 right-0 z-10 bg-white border-2 p-4 max-w-md min-h-10">
        Install the murmur web app to enable background message updates so you
        can be notified when you get a new message
        <br />
        <br />
        <Button onClick={handleInstall}>Install murmur</Button>{' '}
        <Button onClick={handleDecline}>Not now</Button>
      </div>
    </Show>
  );
};

export default InstallPWA;
