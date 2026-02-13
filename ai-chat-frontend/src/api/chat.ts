import api from './api';

export async function sendMessage(chatId:number, message:string) {
  const response = await api.post("/chat", {
    chat_id: chatId,
    message
  });

  return response.data;
}
