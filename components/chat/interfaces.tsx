import React from 'react';

export interface BaseProps {
  prefix?: string;
  locale?: ChatLocale;
  channel?: string;
  emit?: Function;
  track?: Function;
  connect?: Function;
  user?: UserType;
  Socket?: any;
  callUser?: Function;
  success?: Function;
  messageTypes?: Array<string>;
  showAllHistory?: boolean;
  historyStateDate?: string;
}
export type UserType = {
  userId: string;
  username: string;
  companyName: string;
  name: string;
};

export type SendSizeType = 'default' | 'small' | undefined;

export interface ProviderProps extends BaseProps {}
export interface ChatProps extends ProviderProps {
  channel: string;
  tools: Array<string> | boolean;
  useSend: boolean;
  useMessage: boolean;
  useHeader: boolean;
  className?: string;
  sendSize: SendSizeType;
}

export interface ConsumerProps {
  isConsumer: boolean;
}

export type MessageItemType = {
  type: string;
  content: any;
};

export enum MessageType {
  TEXT = 'text',
  EMO = 'emoji',
  IMAGE = 'pasteImage',
  LINK = 'link',
  HTML = 'html',
  NEWS = 'news',
  ELEMENT = 'element',
  GIF = 'gif',
  SHOW_ALL = 'show_all',
  CUSTOM_PC = 'custom_pc'
}

export enum MessageTypeEnum {
  CHAT = 'CHAT',
  NEWS = 'NEWS',
  SYSTEM_NOTICE = 'SYSTEM_NOTICE'
}

export enum ChatToolEnum {
  EMOJI = 'EMOJI',
  DANMAKU = 'DANMAKU',
  CRYPTONYM = 'CRYPTONYM',
  TREND = 'TREND',
  SEARCH = 'SEARCH'
}

export interface SendProps extends BaseProps {
  className?: string;
  permission?: Array<string>;
  isGag?: boolean;
  textMaxLength?: number;
  anonymousName?: string;
  isAnonymous?: boolean;
  fontSize?: string | number;
  trendType?: string;
  history?: boolean;
  emo?: any;
  uploadImage?: any
}

export interface SendState {
  textLength: number;
  often: boolean;
  textSendRecord: Array<number>;
}

export interface SendButtonProps extends BaseProps {
  onClick: Function;
  permission?: Array<string>;
}

export interface SendButtonState {
  shortcutKey: string;
}

export interface ToolProps extends BaseProps {
  className?: string;
}

export interface AnonProps extends BaseProps {
  className?: string;
  isAnonymous?: boolean;
  permission?: Array<string>;
}

export interface AnonState {
  checked: boolean;
}

export interface EmojiProps extends BaseProps {
  className?: string;
  uploadEmo?: any,
  cEmoji?: any
}

export interface EmojiState {
  show: boolean;
  x: number;
  y: number;
  collectEmoji: Array<string>;
}

export interface ContentProps extends BaseProps {
  className?: string;
  historyMessage?: any;
}

export interface ContentState {
  chatMessage: Array<any>;
  auto: boolean;
}

export interface HeaderProps extends BaseProps {
  className?: string;
  count?: number;
}

export interface HeaderState {
  count: number;
}

export interface NoticeProps extends BaseProps {
  notice?: string;
  top: number;
}

export interface NoticeState {
  show: boolean;
}

export interface MessageTipProps extends BaseProps {
  message?: any;
  show: boolean;
  onClick: React.MouseEventHandler<HTMLElement>;
}

export interface MessageProps extends BaseProps {
  data: any;
  permission?: Array<string>;
  pcHasAuth?: Array<string>;
  pcApplyAuth?: Array<string>;
}

export interface LoadMoreProps extends BaseProps {
  start: number;
  startDate: string;
  loading: boolean;
  total: number;
  pageSize: number;
}

interface TrendItem {
  NONE: string;
  BULLISH: string;
  SHORT: string;
}
export interface ChatLocale {
  userCount: string;
  inputTip: Function;
  noChatPermissionText: string;
  gagText: string;
  oftenText: string;
  anonSendText: string;
  sendText: string;
  collectOftenError: string;
  collectFileError: string;
  anon: string;
  EnterSend: string;
  CtrlEnterSend: string;
  systemMessage: string;
  gagMenuText: string;
  unGagMenuText: string;
  showMore: string;
  loadMore: string;
  noLoadMore: string;
  trendType: TrendItem;
  emijione: string;
  image: string
}

export enum PermissionEnum {
  MESSAGE_BOARD = 'message_board',
  DANMAKU_FONT = 'danmaku_font',
  DANMAKU_COLOR = 'danmaku_color',
  CHAT_ROOM = 'chat_room',
  MARKET_PREDICTION = 'market_prediction',
  PREDICT_SCORE = 'predict_scores'
}

export enum ChatPermissionEnum {
  DANMAKU_FONT = 'danmaku_font', // 弹幕字体
  DANMAKU_COLOR = 'danmaku_color', // 弹幕颜色
  CHAT_ROOM = 'chat_room', // 聊天室
  ANONYMOUS_PERM = 'anonymous_perm', // 匿名
  CHAT_GAG = 'chat_gag', // 禁言管理员
  DANMAKU = 'danmaku', // 弹幕权限
  DANMAKU_DEFAULT = 'danmaku_default' // 弹幕开关默认值
}

export enum LocalStorageKey {
  newsOpen = 'newsOpen',
  isAnonymous = 'isAnonymous',
  danmakuColor = 'danmakuColor',
  danmakuFontSize = 'danmakuFontSize',
  comparisonSuspension = 'comparisonSuspension',
  shortcutKey = 'shortcutKey',
  salesInfoSelectIndex = 'salesInfoSelectIndex'
}

export enum FsType {
  EMO = 'EMO',
  PASTE_IMAGE = 'PASTE_IMAGE',
  XLSX = 'XLSX'
}

export enum TrendType {
  NONE = 'NONE',
  BULLISH = 'BULLISH',
  SHORT = 'SHORT'
}
