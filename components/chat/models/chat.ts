import {LocalStorageKey} from '../interfaces';
import {getLocalStorageItem} from '../common';
import {chat, chatGag, tender} from './urls';

export default (prefix: string) => [
  {
    key: 'chat',
    initialState: {
      channel: 'credBChat',
      isOpen: false,
      showSetting: false,
      isAnonymous: getLocalStorageItem(LocalStorageKey.isAnonymous, 'false') === 'true',
      fontSize: getLocalStorageItem(LocalStorageKey.danmakuFontSize, 12) || 12,
      colorIndex: '#FFFFFF',
      history: false,
      emo: undefined,
      selectMessageId: null
    },
    loading: (state: any, action: any) => {
      return Object.assign({}, state, {...action.payload});
    }
  },
  {
    key: 'chatMessage.clientCount',
    method: 'get',
    url: (code: string) => `${prefix}${chat}clients/count?chatRoomCode=${code}`
  },
  {
    key: 'chatMessage.history',
    initialState: {
      pageInfo: {startIndex: 0, totalSize: 0, endIndex: 0},
      result: [],
      enableLoad: true
    },
    method: 'post',
    url: () => `${prefix}${chat}chat/messages/query`,
    loading: (state: any) => {
      const h = {...state.history};
      h.pageInfo = {startIndex: 0, totalSize: 0, endIndex: 0};
      h.result = [];
      h.loading = true;
      h.success = false;
      h.enableLoad = true;
      return h;
    },
    success: (state: any, action: any) => {
      const h = {...state.history};
      const {pageInfo, result} = action.result;
      h.pageInfo = {...h.pageInfo, ...pageInfo};
      h.result = [...(result || []), ...(h.result || [])];
      h.result.sort(function(a: any, b: any) {
        return a.time - b.time;
      });
      h.loading = false;
      h.success = true;
      h.enableLoad = (result || []).length >= action.payload.pageSize;
      h.status = action.status;
      return h;
    }
  },
  {
    key: 'chatMessage.histories',
    initialState: {
      pageInfo: {startIndex: 0, totalSize: 0, endIndex: 0},
      result: [],
      enableLoad: true
    },
    method: 'post',
    url: () => `${prefix}${chat}chat/messages/query`,
    loading: (state: any, action: any) => {
      const h = {...state.histories};
      if (action.payload.startIndex === 0) {
        h.pageInfo = {startIndex: 0, totalSize: 0, endIndex: 0};
        h.result = [];
      }
      h.loading = true;
      h.success = false;
      h.enableLoad = true;
      return h;
    },
    success: (state: any, action: any) => {
      const h = {...state.histories};
      const {pageInfo, result} = action.result || {};
      if (action.payload === 'clear') {
        h.pageInfo = {startIndex: 0, totalSize: 0, endIndex: 0};
        h.result = [];
        h.enableLoad = true;
      } else {
        h.pageInfo = {...h.pageInfo, ...pageInfo};
        h.result = [...(result || []), ...(h.result || [])];
        h.result.sort(function(a: any, b: any) {
          return a.time - b.time;
        });
        h.enableLoad = (result || []).length >= action.payload.pageSize;
      }
      h.loading = false;
      h.success = true;
      return h;
    }
  },
  {
    key: 'chatMessage.anonymousName',
    method: 'get',
    url: (code: string) => `${prefix}${chat}anonnames/anonname?chatRoomCode=${code}`
  },
  {
    key: 'chatGag.gag',
    method: 'post',
    url: ({userId, chatRoomCode}: any) => `${prefix}${chatGag}gaguser?userId=${userId}&chatRoomCode=${chatRoomCode}`
  },
  {
    key: 'chatGag.isGag',
    method: 'get',
    url: ({userId, chatRoomCode}: any) => `${prefix}${chatGag}isag?userId=${userId}&chatRoomCode=${chatRoomCode}`
  },
  {
    key: 'chatGag.ungag',
    method: 'delete',
    url: ({userId, chatRoomCode}: any) => `${prefix}${chatGag}gaguser?userId=${userId}&chatRoomCode=${chatRoomCode}`
  },
  {
    key: 'chatPermission',
    method: 'get',
    url: (code: string) => `${prefix}${chat}chatrooms/users/user/permissions?chatRoomCode=${code}`
  },
  {
    key: 'chatTrend.type',
    method: 'get',
    url: () => `${prefix}${tender}market/trend/vote`
  },
  {
    key: 'chatTrend.change',
    method: 'put',
    url: (trendType: string) => `${prefix}${tender}market/trend/vote?trend=${trendType}`,
    body: () => null
  }
];
