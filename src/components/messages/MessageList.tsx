import { createSignal, For, lazy, onMount } from 'solid-js';

import hashCode from '../../utils/hash';
import { useChatData } from '../../providers/Supabase';

const Avatar = lazy(() => import('../Avatar'));

type Message = { text: string; email: string };

export function Message(props: Message & { lastItem: boolean }) {
  const email = props.email;
  const text = props.text;
  const lastItem = props.lastItem;

  const [itemRef, setItemRef] = createSignal<HTMLElement | null>(null);

  const userEmail = useChatData().username;

  const isMessageFromUser = userEmail() === email;

  const hash = hashCode(email);

  // console.log('email', email, hash);

  onMount(() => {
    setTimeout(
      () =>
        itemRef()?.scrollIntoView({
          behavior: 'smooth',
        }),
      200
    );
  });

  return (
    <li
      class={[
        'my-2 p-2 pb-4 border-2 max-w-[90%]',
        isMessageFromUser ? 'self-end' : 'self-start',
      ].join(' ')}
      ref={(el) => lastItem && setItemRef(el)}
    >
      <div class="text-[1.2rem]">{text}</div>
      <div
        class={[
          'flex items-center',
          isMessageFromUser ? 'justify-end' : 'justify-start',
        ].join(' ')}
      >
        <Avatar
          src={`https://avatars.dicebear.com/api/pixel-art-neutral/${hash}.svg?scale=108`}
        />{' '}
        {email}
      </div>
    </li>
  );
}

function MessageList(props: { messages: Message[] }) {
  return (
    <ul class="flex flex-col m-2">
      <For each={props?.messages || []}>
        {({ text, email }: Message, index) => (
          <Message
            email={email}
            text={text}
            lastItem={props.messages.length === index() + 1}
          />
        )}
      </For>
    </ul>
  );
}

export default MessageList;
