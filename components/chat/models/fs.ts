import {tender} from './urls';

export default (prefix: string) => [
  {
    key: 'chatFile',
    method: 'post',
    headers: {
      Accept: 'application/json'
    },
    url: () => `${prefix}${tender}fs/upload`,
    body: (payload: any) => payload.file,
    loading: (state: any, action: any) => {
      state[action.payload.type] = {
        success: false,
        loading: true,
        url: undefined,
        payload: action.payload
      };
      return Object.assign({}, state);
    },
    success: (state: any, action: any) => {
      state[action.payload.type] = {
        success: true,
        loading: false,
        url: action.result,
        payload: action.payload
      };
      return Object.assign({}, state);
    },
    fail: (state: any, action: any) => {
      state[action.payload.type] = {
        success: false,
        loading: false,
        url: undefined,
        error: action.error,
        payload: action.payload
      };
      return Object.assign({}, state);
    }
  }
];
