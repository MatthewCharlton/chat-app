import { createSignal, Show } from 'solid-js';
import { useLocation, useNavigate } from 'solid-app-router';

import Button from '../Button';

import { useChatData } from '../../providers/Supabase';

function Error(props: { message: string }) {
  return <div>{props.message}</div>;
}

function SendPasswordRequest() {
  const state = useChatData();
  const [noEmailMessage, setNoEmailMessage] = createSignal('');

  const handleSubmitPasswordResetRequest = async (event: SubmitEvent) => {
    event.preventDefault();

    const email = (document.getElementById('email') as HTMLInputElement)?.value;

    if (!email) {
      setNoEmailMessage('Please enter an email');
      return;
    } else {
      setNoEmailMessage('');
    }

    const { data, error } = await state.supabase.auth.resetPasswordForEmail(
      email
    );

    if (error) {
      console.log('error', error);
    }
    if (data) {
      console.log('data', data);
    }
  };
  return (
    <form
      class="mx-auto max-w-sm my-6"
      onSubmit={handleSubmitPasswordResetRequest}
    >
      <div class="p-2">
        <label for="email">
          Email <br />
          <input class="p-2 border-2 w-full" id="email" type="text" />
        </label>
      </div>
      <div class="p-2">{noEmailMessage()}</div>
      <div class="p-2">
        <Button type="submit">Send password reset request</Button>
      </div>
    </form>
  );
}

function LoginWithEmail() {
  const [passwordError, setPasswordError] = createSignal('');
  const state = useChatData();

  const location = useLocation();
  location.hash;
  const navigate = useNavigate();

  let searchParams = new URLSearchParams(window.location.hash);

  // Iterate the search parameters
  let accessToken = '';
  for (let p of searchParams) {
    if (p[0].includes('access_token')) {
      accessToken = p[1];
      break;
    }
    // console.log(p);
  }

  const handleUpdatePassword = async (event: SubmitEvent) => {
    event.preventDefault();

    const password1 = (
      document.getElementById('new-password') as HTMLInputElement
    )?.value;
    const password2 = (
      document.getElementById('reenter-new-password') as HTMLInputElement
    )?.value;

    if (password1 !== password2) {
      setPasswordError('Passwords do not match');
    }

    const invalid = !!passwordError();
    if (!invalid) {
      const { data, error } = await state.supabase.auth.updateUser({
        password: password1,
      });

      if (error) {
        console.log('error :>> ', error);
        // setLoginError(error.message);
      } else {
        navigate('/');
        // setSignupSuccess(email);
      }
    }
  };

  return (
    <>
      <Show when={passwordError()}>
        <Error message={passwordError()} />
      </Show>

      <Show
        when={window.location.hash.includes('type=recovery')}
        fallback={<SendPasswordRequest />}
      >
        <form class="col-span-6 mx-2 my-6" onSubmit={handleUpdatePassword}>
          <div class="m-2">
            <label>
              Enter new password
              <input
                id="new-password"
                class="border-2"
                type="password"
                required
              />
            </label>
          </div>
          <div class="m-2">
            <label>
              Re-enter new password
              <input
                id="reenter-new-password"
                class="border-2"
                type="password"
                required
              />
            </label>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Show>
    </>
  );
}

export default LoginWithEmail;
