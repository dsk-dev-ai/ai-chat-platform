import api from './api';

export async function fetchHistory(chatId:number){
  const response = await api.get(`/history/${chatId}`);
  return response.data;
}

export async function fetchUserChats(){
  const response = await api.get('/chats');
  return response.data;
}

export async function createChat(title: string = "New Chat"){
  const response = await api.post('/chats', { title });
  return response.data;
}
