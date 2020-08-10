import React from 'react';
import classNames from 'classnames';
import {MessageTipProps, MessageType} from '../interfaces';

export default function(props: MessageTipProps) {
  const {prefix, message, show, onClick, locale} = props;
  const className = classNames(`${prefix}-tip`, {
    [`${prefix}-tip-hidden`]: !show || !message
  });

  let title = '';
  let content = '';
  let messageId = '';
  if (message && message.message && message.message instanceof Array) {
    title = message.showName + ':';
    messageId = '#' + message.id;
    const type = message.message[0].type;
    if (type === MessageType.EMO || type === MessageType.GIF) {
      content = `[${locale && locale.emijione}]`;
    } else if (type === MessageType.IMAGE) {
      content = `[${locale && locale.image}]`;
    } else if (type === MessageType.HTML) {
    } else {
      content = message.message[0].content;
    }
  }

  return (
    <a href={messageId} className={className} onClick={onClick}>
      <span>{title}</span>
      <div className={`${prefix}-tip-content`}>{content}</div>
    </a>
  );
}
