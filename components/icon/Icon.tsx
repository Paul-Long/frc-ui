import React from 'react';
import classNames from 'classnames';

interface IconProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;
}
export default function(props: IconProps) {
  const {type, className, ...other} = props;
  const cls = classNames('swc-icon sumscope-icon', `icon-${type}`, className);
  return <i {...other} className={cls} {...other} />;
}
