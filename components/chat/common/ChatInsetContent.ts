import classNames from 'classnames';
import {MessageType as Type} from '../interfaces';
import transparent from '../images/transparent.png';
import {fromItem, pca, title} from './Html';

const underName = {
  '4': '平安利顺'
};

export default (data: any, content: any, callback?: any) => {
  let node: any = null;
  if (data.type === Type.TEXT) {
    if (data.style) {
      node = document.createElement('span');
      node.innerHTML = data.content;
      node.style = data.style;
    } else {
      node = document.createTextNode(data.content);
    }
    node.eleType = data.type;
  } else if (data.type === Type.EMO) {
    node = document.createElement('img');
    node.className = classNames(['emojione', data.content]);
    node.src = transparent;
  } else if (data.type === Type.IMAGE) {
    node = document.createElement('img');
    node.className = classNames(['chat-image']);
    node.src = data.content;
    node.onclick = callback;
  } else if (data.type === Type.LINK) {
    node = document.createElement('a');
    node.href = data.content;
    node.className = classNames(['chat-link']);
    node.target = '_blank';
    node.innerHTML = data.content;
  } else if (data.type === Type.HTML) {
    node = document.createElement('div');
    node.innerHTML = data.content;
    let aa = node.getElementsByTagName('a');
    const length: number = aa ? aa.length : 0;
    for (let i = 0; i < length; i++) {
      aa[i].target = '_blank';
    }
  } else if (data.type === Type.NEWS) {
    node = document.createElement('div');
    node.innerHTML = data.content;
    let aa = node.getElementsByTagName('a');
    const length: number = aa ? aa.length : 0;
    for (let i = 0; i < length; i++) {
      aa[i].target = '_blank';
    }
  } else if (data.type === Type.ELEMENT) {
    node = document.createElement(data.content);
  } else if (data.type === Type.GIF) {
    node = gif(data, content, callback);
  } else if (data.type === Type.SHOW_ALL) {
    node = document.createElement('a');
    node.innerText = data.content;
    node.style = 'color:#0D4FB8;text-decoration:underline;margin-left:5px;';
    node.onclick = callback;
  } else if (data.type === Type.CUSTOM_PC) {
    const d = data.content;
    node = document.createElement('div');
    let innerHTML = '<span>';
    innerHTML += title(`${d.maturityTerm}&nbsp;&nbsp;&nbsp;${d.shortName}`);
    innerHTML += fromItem(
      '【当前边际】：',
      !data.isHas ? '***' : d.bidRate === null ? '' : d.bidRate ? `${d.bidRate}%` : ''
    );
    innerHTML += fromItem(
      '【全场倍数】：',
      !data.isHas ? '***' : d.marketMutiple === null ? '' : d.marketMutiple || ''
    );
    innerHTML += fromItem('【边际倍数】：', !data.isHas ? '***' : d.bidMultiple === null ? '' : d.bidMultiple || '');
    innerHTML += fromItem(
      '【发行人预期】：',
      !data.isHas ? '***' : d.issuerExpect === null ? '' : d.issuerExpect || ''
    );
    if (data.isHas) {
      innerHTML += fromItem('【备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注】：', d.margGuid);
    }
    innerHTML += '</span>';
    node.innerHTML = innerHTML;
    if (!data.isHas && !data.isApply) {
      node.appendChild(pca(false, underName[d.underwriterId], callback));
    } else if (!data.isHas && data.isApply) {
      node.appendChild(pca(true, underName[d.underwriterId], callback));
    }
  }
  if (node) {
    node.eleType = data.type;
    node.content = data.content;
    content.appendChild(node);
    content.appendChild(document.createTextNode(''));
  }
  return node;
};

const gif = (data: any, content: any, callback: any) => {
  let node = document.createElement('div');
  node.className = classNames(['collect-emoji-warp']);
  let img = document.createElement('img');
  img.src = data.content;
  img.className = classNames(['custom-emoji']);
  node.appendChild(img);
  if (typeof callback !== 'function') {
    return node;
  }
  let div = document.createElement('div');
  let i = document.createElement('i');
  div.className = classNames(['collect-emoji-div']);
  i.className = classNames(['collect-emoji-icon sumscope-icon icon-star-o']);
  div.appendChild(i);
  div.onclick = function() {
    callback(data.content);
  };
  let timeout: any = null;
  node.onmouseover = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const rect = img.getBoundingClientRect();
    div.style.cssText =
      'width: ' + rect.width + 'px; ' + 'height: ' + rect.height + 'px; ' + 'top: ' + 0 + 'px; ' + 'left: ' + 0 + 'px;';
    let min = Math.min(rect.width, rect.height);
    i.style.cssText = 'font-size: ' + Math.round(min / 2) + 'px;';
    node.appendChild(div);
  };
  node.onmouseout = function() {
    timeout = setTimeout(() => {
      node.removeChild(div);
      clearTimeout(timeout);
      timeout = null;
    }, 200);
  };
  return node;
};
