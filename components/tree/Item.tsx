import React, {CSSProperties} from 'react';
import classNames from 'classnames';
import Checkbox from '../checkbox';
import SwitcherIcon, {SwitcherProps} from '../components/switcher-icon';
import {ItemProps} from './types';


export default function(props: ItemProps) {
  const {prefix, className, option, onChange, expanded, checked, hasSelected, rowHeight, parentWidth, clickRow} = props;
  const {text, selectEnable, expandEnable, expandPlace, disabled, index, render, expandedIcon} = option;
  const cls = classNames(`${prefix}-item`, className, {
    disabled,
    'is-parent': index === 0
  });

  function expand() {
    if (typeof onChange === 'function' && !disabled) {
      onChange('expand', !expanded);
    }
  }

  function select() {
    if (typeof onChange === 'function' && !disabled) {
      onChange('check', !checked);
    }
  }

  const paddingLeft = (index * 20) + 10;
  let style: CSSProperties = {
    paddingLeft: paddingLeft,
    height: rowHeight,
    lineHeight: `${rowHeight}px`
  };
  if (hasSelected) {
    style.color = '#F9C152';
  }
  let hidden = !expandEnable && !expandPlace;
  let expandProps: SwitcherProps = {
    expanded, hidden: !expandEnable && expandPlace,
    onChange: expand,
    style: {lineHeight: `${rowHeight}px`}
  };
  let otherIcon: Element;
  if (typeof expandedIcon === 'function') {
    otherIcon = expandedIcon(option, expanded, checked);
    hidden = false;
    expandProps.hidden = false;
    expandProps.icon = otherIcon;
  }
  let icon = !hidden && <SwitcherIcon {...expandProps} />;
  const textLeftWidth = (!hidden ? 12 + 4 : 0) + (selectEnable ? 12 + 4 : 0);
  const textStyle = {
    width: `calc(100% - ${textLeftWidth}px)`
  };
  let content: string = text;
  if (typeof render === 'function') {
    const span: HTMLSpanElement = document.createElement('span');
    span.innerText = content;
    span.style.visibility = 'hidden';
    document.body.appendChild(span);
    content = render(option, {parentWidth: parentWidth - textLeftWidth - paddingLeft - 10, width: span.offsetWidth});
    document.body.removeChild(span);
  }
  const contentProps: any = {};
  if (clickRow) contentProps.onClick = expand;
  if (selectEnable) contentProps.onClick = select;
  return (
    <div className={cls} style={style}>
      {icon}
      {selectEnable && <Checkbox checked={checked} onChange={select} style={{lineHeight: `${rowHeight}px`}} />}
      <div className={`${prefix}-item-text`} style={textStyle} {...contentProps}>
        {content}
      </div>
    </div>
  );
}