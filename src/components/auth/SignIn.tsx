import { createSignal, createEffect } from 'solid-js';
import { Link, useNavigate } from 'solid-app-router';

import Button from '../Button';

import { useChatData } from '../../providers/Supabase';

function LoginWithEmail() {
  const state = useChatData();
  const navigate = useNavigate();

  const [user, setUser] = createSignal('');
  const [error, setError] = createSignal('');

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)
      ?.value;

    const { data, error } = await state.supabase.auth.signInWithPassword({
      email,
      password,
    });

    // const { user, error } = await state.supabase.auth.signUp({
    //   email,
    //   password,
    // });

    if (error) {
      console.log('error :>> ', error);
      setError(error.message);
      return;
    }
    console.log('data', data);

    setUser(data.user?.email || '');
  };

  createEffect(() => {
    (user() || state?.username()) && navigate('/murmur/');
  });

  return (
    <form class="mx-auto max-w-sm my-6" onSubmit={handleSubmit}>
      {error() ? <span>{error()}</span> : null}
      <div class="p-2">
        <label for="email">
          Email <br />
          <input
            class="p-2 border-2 w-full"
            id="email"
            type="email"
            required
            autocomplete="email"
          />
        </label>
      </div>
      <div class="p-2">
        <label for="password">
          Password <br />
          <input
            class="p-2 border-2 w-full"
            id="password"
            type="password"
            required
          />
        </label>
      </div>
      <div class="p-2">
        <Button type="submit">Submit</Button>
      </div>
      <br />
      <div class="mx-2 my-1">
        <Link class="underline" href="/murmur/reset-password">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}

export default LoginWithEmail;
