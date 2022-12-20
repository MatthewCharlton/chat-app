import {
  createSignal,
  createContext,
  useContext,
  onCleanup,
  Component,
  Accessor,
  JSX,
} from 'solid-js';
import {
  createClient,
  RealtimeChannel,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { get, set } from 'idb-keyval';

type Message = {
  id: string;
  text: string;
  email: string;
};

type StateContext = {
  supabase: SupabaseClient;
  username: Accessor<string>;
  routeHash: Accessor<string>;
  messages: Accessor<Message[]>;
};

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

const DB_NAME_CHAT_DATA = 'chat-data';
const IDB_LAST_SEEN_MESSAGE_KEY = 'last-seen-message';

let mySubscription: RealtimeChannel | null = null;

const [username, setUsername] = createSignal('');
const [routeHash, setRouteHash] = createSignal('/murmur/');
const [messages, setMessages] = createSignal([] as Message[]);

const state = {
  supabase,
  username,
  routeHash,
  messages,
};

const SupabaseContext = createContext<StateContext>(state);

const sendMessageToSW = (type: string, payload: any) => {
  navigator.serviceWorker?.ready.then(async (registration) => {
    navigator.serviceWorker.controller?.postMessage({
      type,
      payload,
    });
  });
};

export const ChatDataProvider: Component<{
  children: JSX.Element;
}> = (props) => {
  const [loadingInitial, setLoadingInitial] = createSignal();
  const [error, setError] = createSignal();

  const handleWindowVisible = async () => {
    if (window?.document.hidden) return;
    const message = await get(IDB_LAST_SEEN_MESSAGE_KEY);
    if (!message) return;
    const { id = 0 } = message;
    const { data, error } = await supabase
      .from(DB_NAME_CHAT_DATA)
      .select()
      .gt('id', id);

    if (error) {
      console.error(error);
      return;
    }
    if (!data || !data.length) return;
    setMessages((prevMessages) => [...prevMessages, ...data]);
  };

  window?.addEventListener('visibilitychange', handleWindowVisible);

  const getInitialMessages = async () => {
    if (!messages().length) {
      const { data, error } = await supabase
        .from(DB_NAME_CHAT_DATA)
        .select()
        .order('id', { ascending: true });

      setLoadingInitial(false);

      if (error) {
        // console.log(`error`, error);
        setError(error.message);
        if (!mySubscription) return;
        supabase.removeChannel(mySubscription);
        mySubscription = null;
        return;
      }
      if (!data || !data.length) return;
      setMessages(data);
      sendMessageToSW('LAST_MESSAGE_ID', data);
    }
  };

  const subscribe = () => {
    mySubscription = supabase
      .channel(DB_NAME_CHAT_DATA)
      .on('postgres_changes', { event: '*', schema: '*' }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        sendMessageToSW('LAST_MESSAGE_ID', [newMessage]);
      })
      .subscribe();
  };

  const setSessionTokenInIDB = (session: Session | null) => {
    if (session) set('session-token', session);
  };

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') setUsername('');

    if (event === 'SIGNED_IN') {
      setUsername(session?.user?.email || '');
      setSessionTokenInIDB(session);
      getInitialMessages();
      subscribe();
    }
  });

  const { hash, pathname } = window?.location;
  if (hash && pathname === '/murmur/') {
    setRouteHash(hash);
  }

  onCleanup(() => {
    window?.removeEventListener('visibilitychange', handleWindowVisible);
    if (!mySubscription) return;
    supabase.removeChannel(mySubscription);
  });

  return (
    <SupabaseContext.Provider value={state}>
      {props.children}
    </SupabaseContext.Provider>
  );
};

export { supabase };

export function useChatData() {
  return useContext(SupabaseContext) || {};
}
