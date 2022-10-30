import { lazy, Show } from 'solid-js';
import { Link } from 'solid-app-router';

import { useChatData } from '../../providers/Supabase';
import logo from '/murmur.png';

const SignOut = lazy(() => import('../Auth/SignOut'));

const Header = () => {
  const state = useChatData();
  return (
    <header class="flex px-2 col-span-6 items-center justify-between bg-[#46cbb2] shadow-md">
      <Link class="py-2" href="/murmur/">
        <img class="w-40" src={logo} alt="" />
      </Link>
      <Show<boolean>
        when={!!state?.username()}
        fallback={
          <Link class="p-2" href="/murmur/sign-in">
            Sign in
          </Link>
        }
      >
        <SignOut />
      </Show>
    </header>
  );
};

export default Header;
