import React from 'react';
import classNames from 'classnames';
import uuid from 'uuid';
import {Consumer} from '../common/Hoc';
import Inset from '../common/ChatInsetContent';
import {
  FsType,
  LocalStorageKey,
  MessageItemType,
  MessageType,
  PermissionEnum,
  SendProps,
  SendState,
  TrendType
} from '../interfaces';
import Button from './Button';
import {getLocalStorageItem} from '../common';

@Consumer([
  'textMaxLength',
  'isGag',
  'isAnonymous',
  'permission',
  'fontSize',
  'trendType',
  'emo',
  'uploadImage',
  'history',
  'anonymousName'
])
class Send extends React.PureComponent<SendProps, SendState> {
  urlReg: RegExp = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;

  textMaxFreq: number = 10;

  textTimeWindow: number = 10;

  textSendRecord: Array<number> = [];

  chatMessage?: HTMLElement;

  currentType: string | undefined;

  constructor(props: SendProps) {
    super(props);
    this.state = {
      textLength: 0,
      often: false,
      textSendRecord: []
    };
  }

  componentWillReceiveProps(nextProps: SendProps) {
    const {emo, textMaxLength, uploadImage} = nextProps;
    if (emo && emo !== this.props.emo) {
      if (emo.type === 'emo') {
        if (textMaxLength && textMaxLength > this.state.textLength) {
          this.insetContent(MessageType.EMO, emo.emo);
          this.setState({textLength: this.state.textLength + 1});
        }
      } else if (emo.type === 'collectEmo') {
        let message = [{type: MessageType.GIF, content: emo.emo}];
        this.send(message);
      }
    }

    if (uploadImage && uploadImage !== this.props.uploadImage && uploadImage.url) {
      this.insetContent(MessageType.IMAGE, uploadImage.url);
    }
  }

  componentDidUpdate(preProps: SendProps, preState: SendState) {
    if (preState.often !== this.state.often) this.moveCursor();
  }

  saveRef = (name: string) => (ref: React.ReactNode) => {
    this[name] = ref;
  };

  getMessage = () => {
    if (!this.chatMessage) return [];
    const childNodes = this.chatMessage.childNodes;
    const length: number = childNodes.length;
    let message: Array<MessageItemType> = [];
    for (let i = 0; i < length; i++) {
      const node = childNodes[i];
      if (node.nodeName === '#text') {
        message = this.analysisText(node['textContent'], message);
      } else if (node['eleType']) {
        message.push({type: node['eleType'], content: node['content']});
      }
    }
    this.setState({textLength: 0});
    return message;
  };

  analysisText = (text: string | null, message: Array<MessageItemType> = []) => {
    if (!text) return message;
    const arr = (text || '').split(' ');
    arr &&
      arr.map((t) => {
        message.push({type: this.urlReg.test(t) ? MessageType.LINK : MessageType.TEXT, content: t});
        message.push({type: MessageType.TEXT, content: ' '});
      });
    return message;
  };

  initColorIndex = (permission: boolean) => {
    const localStorage = window.localStorage;
    let danmakuColor = '#ffffff';
    if (permission && localStorage) {
      const colorValue = localStorage.getItem('danmakuColor');
      if (!colorValue && colorValue !== '') {
        return colorValue;
      }
    }
    return danmakuColor;
  };

  send = (message: Array<MessageItemType> = []) => {
    if (!message || message.length === 0) return;
    const {Socket, user, permission, channel, isAnonymous, fontSize, anonymousName, locale, trendType} = this.props;
    const per = permission || [];
    const fontSizePermission = per.some((p) => p === PermissionEnum.DANMAKU_FONT);
    const colorPermission = per.some((p) => p === PermissionEnum.DANMAKU_COLOR);
    const chatMessage = {
      id: uuid.v1(),
      username: user && user.username,
      isAnonymous,
      channel,
      userId: user && user.userId,
      loginName: user && user.username,
      showName: user && user.companyName + '-' + user.name,
      message,
      style: {
        color: this.initColorIndex(colorPermission),
        fontSize: (fontSizePermission ? fontSize : 20) + 'px'
      }
    };
    if (anonymousName && isAnonymous) {
      chatMessage.showName = ((locale && locale.trendType[trendType || TrendType.NONE]) || '') + anonymousName;
    }
    if (Socket) Socket.send('chat', chatMessage);
  };

  moveCursor = () => {
    if (!this.chatMessage) return;
    this.chatMessage.focus();
    if (window.getSelection && this.chatMessage.lastChild) {
      let sel = window.getSelection();
      let tempRange = document.createRange();
      const n: any = this.chatMessage.lastChild || 0;
      tempRange.setStart(n, 0);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(tempRange);
      }
    }
  };

  insetContent = (type: string, content: any) => {
    if (!this.chatMessage) return;
    this.currentType = type;
    Inset({type, content}, this.chatMessage);
    this.moveCursor();
  };

  handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const {emit} = this.props;
    const textMaxLength = this.props.textMaxLength || 0;
    const {textLength} = this.state;
    let cbd = event.clipboardData;
    for (let i = 0; i < cbd.items.length; i++) {
      let item = cbd.items[i];
      if (item.kind === 'file' || item.type.indexOf('image') > -1) {
        let blob = item.getAsFile();
        if (!blob || blob.size === 0) {
          return;
        }
        const formData = new FormData();
        formData.append('file', blob, '');
        formData.append('ttl', '1d');
        emit &&
          emit('chatFile', {
            type: FsType.PASTE_IMAGE,
            file: formData
          });
        // blobToDataURL(blob, (url) => this.insetContent(Type.IMAGE, url));
      } else if (item.kind === 'string' && item.type === 'text/plain') {
        item.getAsString((str) => {
          let regStr = str;
          regStr = regStr.replace(/\s+/g, '');
          regStr = regStr.replace(/<\/?.+?>/g, '');
          regStr = regStr.replace(/[\r\n]/g, '');
          if (textLength < textMaxLength) {
            let length = regStr.length;
            if (textLength + length > textMaxLength) {
              const remindLength = textMaxLength - textLength;
              let count = 0;
              for (let ti = 0; ti < str.length; ti++) {
                if (!/\s+/g.test(str[ti]) && !/<\/?.+?>/g.test(str[ti]) && !/[\r\n]/g.test(str[ti])) {
                  count += 1;
                }
                if (remindLength <= count) {
                  str = str.substring(0, ti);
                  break;
                }
              }
              length = count;
            }
            this.setState({textLength: this.state.textLength + length});
            str = str.replace(/[\n]/g, ' <br/> ');
            const arr = (str || '').split(' ');
            (arr || []).map((t) => {
              if (t === '<br/>') {
                this.insetContent(MessageType.ELEMENT, 'br');
              } else {
                this.insetContent(this.urlReg.test(str) ? MessageType.LINK : MessageType.TEXT, t);
              }
            });
          }
        });
      } else if (item.kind === 'string' && item.type === 'text/html') {
        item.getAsString((str) => {
          console.log(str);
        });
      }
    }
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const shortcutKey = getLocalStorageItem(LocalStorageKey.shortcutKey, 'EnterSend');
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      if (shortcutKey === 'EnterSend') {
        this.handleAddBlank();
      } else if (shortcutKey === 'CtrlEnterSend') {
        this.handleSend();
      }
    } else if (event.keyCode === 13) {
      if (shortcutKey === 'EnterSend') {
        this.handleSend();
      } else if (shortcutKey === 'CtrlEnterSend') {
        this.handleAddBlank();
      }
    } else {
      this.currentType = MessageType.TEXT;
      if (
        this.state.textLength >= (this.props.textMaxLength || 0) &&
        event.keyCode !== 8 &&
        event.keyCode !== 37 &&
        event.keyCode !== 38 &&
        event.keyCode !== 39 &&
        event.keyCode !== 40
      ) {
        event.preventDefault();
      }
    }
  };

  handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!this.chatMessage) return;
    const {textMaxLength} = this.props;
    const childNodes = this.chatMessage.childNodes;
    let length = 0;
    if (!childNodes) return;
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      if (!node) continue;
      if (node.nodeName === '#text' && node.textContent) {
        let tempLength = length + node.textContent.length;
        if (textMaxLength && tempLength > textMaxLength) {
          node.textContent = node.textContent.substring(0, textMaxLength - length);
          length = textMaxLength;
        } else {
          length = tempLength;
        }
      } else if (node['eleType'] === MessageType.TEXT && node.textContent) {
        let tempLength = length + node.textContent.length;
        if (textMaxLength && tempLength > textMaxLength) {
          node.textContent = node.textContent.substring(0, textMaxLength - length);
          node['content'] = node.textContent;
          length = textMaxLength;
        } else {
          length = tempLength;
        }
      }
    }
    if (textMaxLength && length > textMaxLength) {
      event.preventDefault();
    }
    this.setState({textLength: length});
  };

  handleAddBlank = () => {
    if (this.currentType === MessageType.TEXT || !this.currentType) {
      this.insetContent(MessageType.ELEMENT, 'br');
    }
    this.insetContent(MessageType.ELEMENT, 'br');
  };

  handleSend = (event?: React.MouseEvent<HTMLDivElement>) => {
    if (event) event.preventDefault();
    const message = this.getMessage();
    if (this.checkOften()) {
      this.chatMessage && (this.chatMessage.innerHTML = '');
      return;
    }
    setTimeout(() => {
      this.chatMessage && (this.chatMessage.innerHTML = '');
    }, 16);
    this.send(message);
  };

  handleOnClick = () => {
    this.closeHistory();
    if (this.state.often) {
      this.setState({often: false, textLength: 0});
    }
  };
  handleInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
    this.handleKeyUp(event);
  };

  handleFocus = () => {
    this.closeHistory();
  };

  closeHistory = () => {
    const {emit, success, history} = this.props;
    if (emit && history) {
      emit('chat', {history: false});
      success && success('chatMessage.histories', {payload: 'clear'});
    }
  };

  renderCover = (has: boolean) => {
    const {locale, isGag, prefix} = this.props;
    const {often} = this.state;
    const cls = `${prefix}-send-cover`;
    if (!has) return <div className={cls}>{locale && locale.noChatPermissionText}</div>;
    if (isGag) return <div className={cls}>{locale && locale.gagText}</div>;
    if (often) return <div className={cls}>{locale && locale.oftenText}</div>;
    return null;
  };

  checkOften = (timestamp: number = new Date().getTime()) => {
    const {often} = this.state;
    if (this.textSendRecord.length < this.textMaxFreq) {
      this.textSendRecord.push(timestamp);
      often && this.setState({often: false});
      return false;
    }
    if (this.textSendRecord.length > 0) {
      const first = this.textSendRecord[0];
      if ((timestamp - first) / 1000 > this.textTimeWindow) {
        this.textSendRecord.push(timestamp);
        this.textSendRecord.shift();
        often && this.setState({often: false});
        return false;
      }
    }
    !often && this.setState({often: true});
    return true;
  };

  renderInput = (has: boolean) => {
    const {prefix, isGag} = this.props;
    const {often} = this.state;
    const props = {
      ref: this.saveRef('chatMessage'),
      className: `${prefix}-send-input`,
      contentEditable: has && !isGag && !often,
      onKeyDown: this.handleKeyDown,
      onKeyUp: this.handleKeyUp,
      onPaste: this.handlePaste,
      onClick: this.handleOnClick,
      onInput: this.handleInput,
      onFocus: this.handleFocus
    };
    return <div {...props}>{this.renderCover(has)}</div>;
  };

  renderTip = (has: boolean) => {
    const {textMaxLength} = this.props;
    const {textLength, often} = this.state;
    const {isGag, prefix, locale} = this.props;
    if (has && !isGag && !often) {
      return (
        <div className={`${prefix}-send-text-length`}>
          {locale && locale.inputTip(Math.max((textMaxLength || 0) - textLength, 0))}
        </div>
      );
    }
    return null;
  };

  render() {
    const {prefix, className, permission} = this.props;
    const has = (permission || []).some((p) => p === PermissionEnum.CHAT_ROOM);
    const cls = classNames(`${prefix}-send`, className);
    return (
      <div className={cls}>
        {this.renderInput(has)}
        <div className={`${prefix}-send-bottom`}>
          {this.renderTip(has)} <Button onClick={this.handleSend} />
        </div>
      </div>
    );
  }
}

export default Send;
