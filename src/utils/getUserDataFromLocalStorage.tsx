import { AuthSession } from '@supabase/supabase-js';

export type UserSession = {
  currentSession?:
    | AuthSession
    | {
        user?: {
          email: string;
        };
      };
};

function getUserDataFromLocalStorage() {
  let authToken: UserSession = {};
  try {
    authToken = JSON.parse(window?.localStorage['supabase.auth.token']);
  } catch {}
  return authToken;
}

export default getUserDataFromLocalStorage;
