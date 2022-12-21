import { lazy, onMount } from 'solid-js';
import { DB_NAME_CHAT_DATA } from '../../constants';
import { useChatData } from '../../providers/Supabase';

const Button = lazy(() => import('../Button'));

function MessageCompose() {
  const state = useChatData();

  const email = state.username();

  onMount(() => {
    const textarea = document.getElementById('message') as HTMLSpanElement;

    textarea.addEventListener('keydown', (event: KeyboardEvent) => {
      console.log(event.shiftKey, event.key);

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    });
  });

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    await handleSendMessage();
  };

  const handleSendMessage = async () => {
    const textarea = document.getElementById('message') as HTMLSpanElement;
    let text = textarea.innerText.trim();

    if (!text) return;

    const { error } = await state.supabase
      .from(DB_NAME_CHAT_DATA)
      .insert([{ text, email }]);

    if (error) {
      console.log('error', error);
      return;
    }
    textarea.innerText = '';
    textarea.focus();
  };

  return (
    <form
      id="send-message-form"
      class="bottom-0 sticky flex p-2 bg-white"
      onSubmit={handleSubmit}
    >
      <span
        class="flex-1 border-2 bg-gray-50 focus:bg-white p-2 overflow-hidden resize"
        role="textbox"
        contenteditable
        id="message"
      ></span>
      <Button class="bg-[#46cbb2] text-black" type="submit">
        Send
      </Button>
    </form>
  );
}

export default MessageCompose;
