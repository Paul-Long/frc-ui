export function title(text: string) {
  return `<span style="display: flex;color: #f38b1e;white-space: nowrap;">${text}</span>`;
}

export function fromItem(label: string, text: string) {
  return `<span style="display: flex"><span style="color: #f38b1e;white-space: nowrap;">${label}</span>${text}</span>`;
}

export function button(text: string, callback: any) {
  let btn = document.createElement('button');
  btn.className = 'chat-message-auth-btn';
  btn.innerText = text;
  btn.onclick = callback;
  return btn;
}

export function pca(ay: boolean, un: string, callback: any) {
  let d = document.createElement('div');
  d.style.display = 'flex';
  d.innerHTML = '<span style="color:#f38b1e">【备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注】：</span>';
  const sp = document.createElement('span');
  if (ay) {
    sp.innerHTML = `您已申请${un}机构边际指导查看权限，`;
  } else {
    sp.innerHTML = `您暂无${un}机构边际指导查看权限，`;
  }

  d.appendChild(sp);
  const a = document.createElement('a');
  a.innerText = ay ? '' : '点击此处';
  a.style.color = '#f38b1e';
  a.onclick = callback;
  sp.appendChild(a);
  const sp1 = document.createElement('span');
  if (ay) {
    sp1.innerText = '请等待机构人员审批！';
  } else {
    sp1.innerText = '进行申请!';
  }
  sp.appendChild(sp1);
  d.appendChild(sp);
  return d;
}

export function htmlText(t: string) {
  let span = document.createElement('span');
  span.style.display = 'flex';
  span.style.color = '#color';
  span.style.whiteSpace = 'nowrap';
  span.innerText = t;
  return span;
}
