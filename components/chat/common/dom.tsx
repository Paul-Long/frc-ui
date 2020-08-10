'use strict';

export function getWindowSize() {
  return {
    width: window.innerWidth || document.getElementsByClassName('wrap')[0].clientWidth,
    height: window.innerHeight || document.getElementsByClassName('wrap')[0].clientHeight
  };
}

export function getPosElement(el: any) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom
  };
}

export function isOverFlow(parent: any, w = 0, h = 0) {
  const winSize = getWindowSize();
  let overFlowX;
  let overFlowY;

  const parentPos = getPosElement(parent);
  overFlowX = parentPos.left + w > winSize.width;
  overFlowY = parentPos.top + parentPos.height + h > winSize.height;

  return {
    x: overFlowX,
    y: overFlowY
  };
}

export let listContainer: any = null;

export function isExistedListContainer(className = 'list-container') {
  let isExisted = false;
  const nodeList = document.body.childNodes;
  const len = nodeList.length;
  for (let i = 0; i < len; i++) {
    const node = nodeList.item(i);
    if (node && node.nodeName === 'DIV' && node['className'] === className) {
      isExisted = true;
      listContainer = node;
      break;
    }
  }
  return isExisted;
}

export function createListContainer(className = 'list-container') {
  const div = document.createElement('div');
  div.className = className;
  listContainer = div;
  document.body.appendChild(listContainer);
}
