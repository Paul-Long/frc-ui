import React from 'react';
interface Props {
  onClick?: (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {};
  title?: string;
  btnText?: string;
}
export default function(props: Props) {
  function h_click() {
    window.location.reload();
  }
  return (
    <div className='swc-error'>
      <div style={{width: 300, display: 'inline-block', border: '1px solid #193d37', padding: 10}}>
        <p style={{fontSize: 14, marginBottom: 20, color: '#5e5e5e'}}>{props.title || '页面崩溃'}</p>
        <a onClick={props.onClick || h_click} style={{minWidth: 80}}>
          {props.btnText || '重新载入'}
        </a>
      </div>
    </div>
  );
}
