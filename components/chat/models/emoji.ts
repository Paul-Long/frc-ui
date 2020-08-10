import {chat} from './urls';

export default (prefix: string) => [
  {
    key: 'emoji.list',
    method: 'post',
    url: ({code}: any) => `${prefix}${chat}emojis/query?chatRoomCode=${code}`
  },
  {
    key: 'emoji.collect',
    method: 'post',
    url: ({code, url}: any) => `${prefix}${chat}emojis/collections?chatRoomCode=${code}&url=${encodeURIComponent(url)}`
  },
  {
    key: 'emoji.remove',
    method: 'delete',
    url: ({code, url}: any) => `${prefix}${chat}emojis?chatRoomCode=${code}&url=${encodeURIComponent(url)}`
  },
  {
    key: 'emoji.save',
    method: 'post',
    url: ({code}: any) => `${prefix}${chat}emojis?chatRoomCode=${code}`,
    body: (payload: any) => JSON.stringify(payload.url)
  }
];
