import {tender} from './urls';

export default (prefix: string) => [
  {
    key: 'chatDict',
    method: 'post',
    url: () => `${prefix}${tender}dict/by/groups`,
    loading: (state: any, action: any) => {
      let loadingGroups = {...state};
      for (let group of action.payload) {
        loadingGroups[group] = {success: false, loading: true};
      }
      return loadingGroups;
    },
    success: (state: any, action: any) => {
      let groups = {...state};
      for (let group in action.result) {
        if (Object.prototype.hasOwnProperty.call(action.result, group)) {
          groups[group] = {
            success: true,
            loading: false,
            content: action.result[group]
          };
        }
      }
      return groups;
    },
    fail: (state: any, action: any) => {
      let loadingGroups = {...state};
      for (let group of action.payload) {
        loadingGroups[group] = {
          success: false,
          error: action.error,
          loading: false
        };
      }
      return loadingGroups;
    }
  }
];
