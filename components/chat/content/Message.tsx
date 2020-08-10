import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {Consumer} from '../common/Hoc';
import {ChatPermissionEnum, MessageProps, MessageType} from '../interfaces';
import Inset from '../common/ChatInsetContent';
import {showDateOrTime} from '../common';
import {isExistedListContainer, createListContainer, getPosElement, listContainer} from '../common/dom';

const TEXT_ALL_COUNT = 100;

@Consumer(['permission'])
class Message extends React.PureComponent<MessageProps> {
  container?: HTMLDivElement;

  nameEle?: HTMLSpanElement;

  hasImage: boolean = false;

  showAll: boolean = false;

  images: Array<string> = [];

  componentDidMount() {
    this.appendContent();
  }

  onGag = (code: string) => (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    const {emit, data, channel} = this.props;
    this.showListContainer(false);
    if (emit) {
      emit(`chatGag.${code}`, {userId: data.userId, chatRoomCode: channel});
    }
  };

  appendContent = (props: MessageProps = this.props) => {
    const {emit, track, user, channel, data, locale} = props;
    if (!this.container) return;
    this.container.innerHTML = '';
    let textCount = 0;
    const message = data.message || [];
    for (let i = 0; i < message.length; i++) {
      let d = message[i];
      let callback;
      if (d.type === MessageType.IMAGE) {
        this.hasImage = true;
        this.images.push(d.content);
        callback = () => {
          this.setState({imageShow: true}, () => track && track('聊天室.预览图片'));
        };
      } else if (d.type === MessageType.GIF && data.userId !== (user || {}).userId) {
        callback = function(url: string) {
          emit && emit('emoji.collect', {url, code: channel});
        };
      } else if (d.type === MessageType.TEXT && !this.showAll) {
        let length = d.content.length || 0;
        if (textCount + length > TEXT_ALL_COUNT) {
          d = {...d};
          d.content = d.content.substring(0, TEXT_ALL_COUNT - textCount) + '...';
        }
        textCount += length;
      } else if (d.type === MessageType.CUSTOM_PC) {
        const pcData = d.content || {};
        const pcHasAuth = props.pcHasAuth || [];
        const pcApplyAuth = props.pcApplyAuth || [];
        const isHas = (pcHasAuth || []).some(
          (p: any) =>
            p.permissionTypeEnum === 'p_bjzd' && (p.underwriterIds || []).some((u: any) => u === pcData.underwriterId)
        );
        const isApply = (pcApplyAuth || []).some(
          (p: any) =>
            p.permissionTypeEnum === 'p_bjzd' && (p.underwriterIds || []).some((u: any) => u === pcData.underwriterId)
        );
        d.isHas = isHas;
        if (!isHas) {
          if (!isApply) {
            d.isApply = false;
            callback = function() {
              emit && emit('pc.auth', {underwriterId: pcData.underwriterId, permissionType: 'p_bjzd'});
            };
          } else {
            d.isApply = true;
          }
        }
      }

      Inset(d, this.container, callback);
      if (!this.showAll) {
        if (textCount > TEXT_ALL_COUNT) {
          callback = () => {
            this.showAll = true;
            this.appendContent();
          };
          Inset({type: MessageType.SHOW_ALL, content: locale && locale.showMore}, this.container, callback);
          break;
        }
      }
    }
  };

  showListContainer = (showTabFlag: boolean) => {
    const {prefix, locale} = this.props;

    const options = [
      {code: 'gag', name: locale && locale.gagMenuText},
      {code: 'ungag', name: locale && locale.unGagMenuText}
    ];

    let container: any = <div className='hidden' />;
    if (!isExistedListContainer()) {
      createListContainer();
    }
    if (showTabFlag) {
      let ops = options.map((d) => {
        return (
          <li key={d.code} onMouseDown={this.onGag(d.code)}>
            {d.name}
          </li>
        );
      });
      const parentRect = getPosElement(this.nameEle);
      const style: React.CSSProperties = {};
      style.left = parentRect.left;
      style.top = parentRect.bottom + 2;
      style.width = 100;
      container = (
        <div className={`${prefix}-send-btn-wrap`} style={style}>
          <ul className={`${prefix}-send-btn-list`}>{ops}</ul>
        </div>
      );
    }
    ReactDOM.render(container, listContainer);
  };

  handleClickTitle = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    const {callUser, data, track, permission} = this.props;
    if (event.nativeEvent.ctrlKey) {
      if (data && data.userId && (permission || []).some((p) => p === ChatPermissionEnum.CHAT_GAG)) {
        this.showListContainer(true);
      }
    } else {
      callUser && callUser(data.userId);
      track && track('打开QM');
    }
  };

  handleBlur = () => {
    this.showListContainer(false);
  };

  renderTitle = () => {
    const {data, prefix} = this.props;
    return (
      <span ref={this.saveRef('nameEle')} onClick={this.handleClickTitle} tabIndex={-1} onBlur={this.handleBlur}>
        {data.logUrl && <img src={data.logUrl} className={`${prefix}-message-log`} />}
        {data.showName || ''} :
      </span>
    );
  };

  saveRef = (name: string) => (ele: HTMLDivElement) => {
    this[name] = ele;
  };

  render() {
    const {prefix, data, user} = this.props;

    const pre = `${prefix}-message`;

    const className = classNames(pre, {[`${pre}-auth`]: data && user && (data || {}).userId === (user || {}).userId});

    const aProps: any = {name: data.id};

    return (
      <div className={className}>
        <div className={`${pre}-title`}>
          {this.renderTitle()}
          <span className={`${pre}-time`}>{showDateOrTime(data.time)}</span>
        </div>
        <div ref={this.saveRef('container')} className={`${pre}-content`} />
        <a {...aProps} />
      </div>
    );
  }
}

export default Message;
