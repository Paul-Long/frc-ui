import React from 'react';
import classNames from 'classnames';
import {Provider} from './common/Hoc';
import {ChatProps, ChatToolEnum, MessageTypeEnum} from './interfaces';
import Header from './header';
import Content from './content';
import Send from './send';
import Tool from './tool';
import Notice from './Notice';

@Provider
class Chat extends React.Component<ChatProps> {
  static MessageTypeEnum = MessageTypeEnum;
  static ChatToolEnum = ChatToolEnum;
  static models: Function;
  static defaultProps = {
    messageTypes: Object.keys(MessageTypeEnum),
    tools: Object.keys(ChatToolEnum),
    useSend: true,
    useHeader: true,
    useMessage: true
  };

  componentDidMount() {
    const {channel, user, emit, success, Socket} = this.props;
    if (emit && Socket) {
      emit('chatPermission', channel);
      emit('chatGag.isGag', {userId: user && user.userId, chatRoomCode: channel});
      emit('chatMessage.clientCount', channel);
      emit('chatDict', ['textMaxLength', 'SysNotice']);
      this.sub();
      Socket.on('connect', this.sub);
      Socket.on('reconnect', this.sub);
      Socket.on(`chatroom_userpermission_${channel}`, function(permission: object) {
        success && success('chatPermission', {result: permission});
      });
      Socket.on(`gag_message_${channel}`, function(isGag: boolean) {
        success && success('chatGag.isGag', {result: isGag === true});
      });
      Socket.on('dict', function(dict: object) {
        success && success('chatDict', {result: dict});
      });
      Socket.on('patr_permission_msg', function() {
        emit && emit('pc.hasAuth');
      });
      Socket.on('patr_apply_permission_msg', function() {
        emit && emit('pc.applyAuth');
      });
    }
    window.addEventListener('beforeunload', this.leave);
  }

  sub = () => {
    const {channel, Socket} = this.props;
    Socket.join(channel);
  };

  leave = () => {
    const {channel, Socket} = this.props;
    Socket && Socket.leave(channel);
  };

  getStyle = () => {};

  render() {
    const {className, useSend, useHeader, useMessage, tools, sendSize, prefix, setName} = this.props;

    let useTool: boolean = false;

    if (tools instanceof Array) useTool = tools.length > 0;
    else useTool = !!tools;

    const cls = classNames(prefix, className, {
      [`${prefix}-use-header`]: useHeader,
      [`${prefix}-use-message`]: useMessage,
      [`${prefix}-use-tool`]: useTool,
      [`${prefix}-use-send`]: useSend
    });

    let bottom: number = 0;
    if (useSend) bottom += sendSize === 'small' ? 50 : 128;
    if (useTool) bottom += 28;
    const style: React.CSSProperties = {paddingBottom: bottom + 10};

    return (
      <div className={cls} style={style}>
        {useHeader && <Header />}
        <Notice top={useHeader ? 24 + 1 : 1} />
        {useMessage && <Content />}
        {useTool && useSend && (
          <div className={`${prefix}-bottom`} style={{height: bottom + 10}}>
            {useTool && <Tool />}
            {useSend && <Send setName={setName} className={sendSize === 'small' ? `${prefix}-send-sm` : ''} />}
          </div>
        )}
      </div>
    );
  }
}
export default Chat;
