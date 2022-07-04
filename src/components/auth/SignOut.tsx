import Button from '../Button'

import { useChatData } from '../../providers/Supabase';

function SignOut() {
  const state = useChatData();
  const handleSignOut = async () => {
    const { error } = await state.supabase.auth.signOut();
    console.log('error signing out', error);
    window.location.assign('/murmur/');
  };
  return <Button onClick={handleSignOut}>Sign out</Button>;
}

export default SignOut;
