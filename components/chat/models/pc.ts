import {credb} from './urls';

export default (prefix: string) => [
  {
    key: 'pc.auth',
    method: 'post',
    url: () => `${prefix}${credb}bjzd/permission`
  },
  {
    key: 'pc.hasAuth',
    method: 'get',
    url: () => `${prefix}${credb}bjzd/permissions`
  },
  {
    key: 'pc.applyAuth',
    method: 'get',
    url: () => `${prefix}${credb}bjzd/permissions/status`
  }
];
