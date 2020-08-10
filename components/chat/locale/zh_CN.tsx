import {ChatLocale} from '../interfaces';

const locale: ChatLocale = {
  userCount: '在线人数',
  inputTip: (count: number) => `还可以输入${count}字`,
  noChatPermissionText: '请申请发言权限',
  gagText: '请申请发言权限',
  oftenText: '发言过于频繁',
  anonSendText: '发送',
  sendText: '实名发送',
  collectOftenError: '最多只能收藏30个自定义表情',
  collectFileError: '选择的文件不合规， 请选择文件大小不超过 500K 的图片文件（*.gif, *.jpg, *.png）',
  anon: '匿名',
  EnterSend: '按Enter键发送消息',
  CtrlEnterSend: '按Ctrl+Enter键发送消息',
  systemMessage: '系统消息',
  gagMenuText: '禁言',
  unGagMenuText: '解除禁言',
  showMore: '查看更多',
  loadMore: '点击加载更多',
  noLoadMore: '没有更多消息',
  trendType: {
    NONE: '',
    BULLISH: '多方-',
    SHORT: '空方-'
  },
  emijione: '表情',
  image: '图片'
};

export default locale;
