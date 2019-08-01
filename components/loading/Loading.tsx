import React from 'react';
import classNames from 'classnames';

interface LoadingProps {
  size?: number,
  style?: object,
  className?: string
}
export default function (props: LoadingProps) {
  const {size, style, className, ...other} = props;
  const css = {...style};
  if (size) {
    css['width'] = size;
    css['height'] = size;
  }
  const cls = classNames('swc-loading', className);
  return (
    <div className={cls} {...other}>
      <div className='swc-loading-container' style={css}>
        <svg className='swc-circular' viewBox='25 25 50 50'>
          <circle className='path' cx='50' cy='50' r='20' fill='none' strokeWidth='3' strokeMiterlimit='10' />
        </svg>
      </div>
    </div>
  )
}
