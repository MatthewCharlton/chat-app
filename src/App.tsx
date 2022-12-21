import { lazy, Component, Show, createEffect } from 'solid-js';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'solid-app-router';
import { useRegisterSW } from 'virtual:pwa-register/solid';

import { useChatData } from './providers/Supabase';

const InstallPWA = lazy(() => import('./components/InstallPWA'));
const Layout = lazy(() => import('./components/Layout'));
const Header = lazy(() => import('./components/Header'));
const MessageList = lazy(() => import('./components/Messages/MessageList'));
const MessageCompose = lazy(
  () => import('./components/Messages/MessageCompose')
);
const SignIn = lazy(() => import('./components/Auth/SignIn'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));

const App: Component = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(r) {
      // eslint-disable-next-line no-console
      console.log(`SW Registered: ${r}`);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const state = useChatData();
  const navigate = useNavigate();

  createEffect(() => {
    const location = useLocation();
    const routeHash = state.routeHash();

    if (location.pathname === '/murmur') {
      window.location.pathname = '/murmur/';
    }

    if (routeHash) {
      if (routeHash.endsWith('&type=recovery')) {
        navigate(`/murmur/reset-password/${routeHash}`);
      }
      if (routeHash.startsWith('#error_code=404'))
        return (
          <div>
            <p>This link has expired</p>
            <Link href="/murmur/" style={{ cursor: 'pointer' }}>
              Back to app
            </Link>
          </div>
        );
    }
  });

  return (
    <Layout>
      <Header />
      <Routes>
        <Route
          path="/murmur/"
          element={
            <Show<boolean>
              when={!!state?.username()}
              fallback={<>{navigate('/murmur/sign-in')}</>}
            >
              <InstallPWA />
              <div class="flex flex-col col-span-6 lg:col-span-4 lg:col-start-2">
                <MessageList messages={state.messages()} />
                <MessageCompose />
              </div>
            </Show>
          }
        ></Route>
        <Route
          path="/murmur/sign-in"
          element={
            <div class="col-span-6">
              <SignIn />
            </div>
          }
        ></Route>
        <Route
          path="/murmur/reset-password"
          element={
            <div class="col-span-6">
              <ResetPassword />
            </div>
          }
        ></Route>
        <Route
          path="/*all"
          element={
            <>
              Not found
              <Link class="" href="/murmur/">
                Go home
              </Link>
            </>
          }
        ></Route>
      </Routes>
    </Layout>
  );
};

export default App;
