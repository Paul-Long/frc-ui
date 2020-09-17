import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {ChatProps, ConsumerProps, FsType, TrendType} from '../interfaces';
import zh_CN from '../locale/zh_CN';

const {createContext} = React;
const Context = createContext({});

export function Provider<T extends object>(Component: React.ComponentType<T>): any {
  class WithProvider extends React.Component<T & ChatProps> {
    static defaultProps = {
      locale: zh_CN,
      emit: () => {},
      track: () => {}
    };

    constructor(props: T & ChatProps) {
      super(props);
      const {emit, channel} = props;
      emit && emit('chat', {channel});
    }

    render() {
      const {
        user,
        emit,
        success,
        channel,
        callUser,
        track,
        Socket,
        locale,
        connect,
        messageTypes,
        showAllHistory,
        historyStateDate
      } = this.props;
      const value = {
        user,
        emit,
        success,
        channel,
        callUser,
        track,
        Socket,
        locale,
        connect,
        messageTypes,
        showAllHistory,
        historyStateDate,
        prefix: 'frc-chat'
      };
      return (
        <Context.Provider value={value}>
          <Component {...this.props} prefix='frc-chat' />
        </Context.Provider>
      );
    }
  }
  return hoistStatics(WithProvider, Component);
}

export const Consumer = (keys: Array<string> = []) => <T extends object>(Component: React.ComponentType<T>): any => {
  class WithConsumer extends React.Component<T & ConsumerProps> {
    static defaultProps = {
      isConsumer: true
    };

    getTextMaxLength = (tm: any) => {
      if (tm && tm.success && tm.content && tm.content[0]) {
        return (tm.content[0] || {})['dictValue'] || 0;
      }
      return 0;
    };

    getData = (value: any) => {
      const {channel} = value || {};
      return {
        textMaxLength: (state: any) => {
          const tmp = state.chatDict.textMaxLength || {};
          if (tmp && tmp.success && tmp.content && tmp.content[0]) {
            return (tmp.content[0] || {})['dictValue'] || 0;
          }
          return 0;
        },
        anonymousName: (state: any) => {
          return state.chatMessage.anonymousName.result;
        },
        trendType: (state: any) => {
          return state.chatTrend.type.result || TrendType.NONE;
        },
        isAnonymous: (state: any) => {
          return state.chat.isAnonymous;
        },
        emo: (state: any) => state.chat.emo,
        isGag: (state: any) => state.chatGag.isGag.result,
        fontSize: (state: any) => state.chat.fontSize,
        permission: (state: any) => state.chatPermission.result,
        uploadImage: (state: any) => state.chatFile[FsType.PASTE_IMAGE],
        history: (state: any) => state.chat.history,
        historyMessage: (state: any) => state.chatMessage.history,
        count: (state: any) => state.chatMessage.clientCount.result,
        notice: (state: any) => {
          const tmp = state.chatDict.SysNotice || {};
          if (tmp && tmp.content) {
            const notice = (tmp.content || []).find((d: any) => d['dictKey'] === channel);
            if (notice) return (notice || {}).cn || '';
            return null;
          }
          return null;
        },
        uploadEmo: (state: any) => state.chatFile[FsType.EMO],
        cEmoji: (state: any) => state.emoji.list,
        removeEmoji: (state: any) => state.emoji.remove
      };
    };

    mapStateToProps = (value: any) => (state: any) => {
      const obj: any = {};
      keys.forEach((key) => {
        const func = this.getData(value)[key];
        if (func) obj[key] = func(state);
      });
      return obj;
    };

    renderComponent = (value: any) => {
      const {connect} = value || {};
      const Node = connect ? connect(this.mapStateToProps(value))(Component) : Component;
      return <Node {...this.props} {...(value || {})} />;
    };

    render() {
      const {isConsumer} = this.props;
      if (!isConsumer) return <Component {...this.props} />;
      return <Context.Consumer>{this.renderComponent}</Context.Consumer>;
    }
  }
  return hoistStatics(WithConsumer, Component);
};
