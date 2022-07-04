import { lazy } from 'solid-js';
import { useChatData } from '../../providers/Supabase';

const Button = lazy(() => import('../Button'));

function MessageCompose() {
  const state = useChatData();

  const email = state.username();

  state.messages();

  const handleSendMessage = async (event: SubmitEvent) => {
    event.preventDefault();

    const textarea = event?.target?.[0];

    let text = textarea.value;

    if (!text) return;

    const { error } = await state!.supabase
      .from('chat-data')
      .insert([{ text, email }]);

    if (error) {
      console.log('error', error);
      return;
    }
    textarea.value = '';
    textarea.focus();
  };

  return (
    <form id="send-message-form" class="bottom-0 sticky flex p-2 bg-white" onSubmit={handleSendMessage}>
      <textarea class="flex-1 border-2 bg-gray-50 focus:bg-white max-h-32" name="message" id="message"></textarea>
      <Button class="bg-[#46cbb2] text-black" type="submit">Send</Button>
    </form>
  );
}

export default MessageCompose;
