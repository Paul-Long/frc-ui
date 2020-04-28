import React from 'react';
import classNames from 'classnames';

const Path = {
  checkbox:
    'M896 0l-768 0c-70.41024 0-128 57.61024-128 128l0 768c0 70.41024 57.61024 128 128 128l768 0c70.41024 0 128-57.61024 128-128l0-768c0-70.41024-57.61024-128-128-128zM448 794.50112l-237.2608-237.2608 90.50112-90.50112 146.7392 146.7392 306.74944-306.74944 90.50112 90.50112-397.25056 397.25056z',
  radio:
    'M512 4.533c-279.803 0-507.467 227.665-507.467 507.467 0 279.839 227.629 507.467 507.467 507.467 279.839 0 507.467-227.629 507.467-507.467 0-279.803-227.629-507.467-507.467-507.467zM512 946.65c-239.68 0-434.65-195.006-434.65-434.65 0-239.68 194.97-434.65 434.65-434.65 239.644 0 434.65 194.97 434.65 434.65 0 239.644-195.006 434.65-434.65 434.65zM512 329.955c-100.38 0-182.045 81.665-182.045 182.045s81.665 182.045 182.045 182.045 182.045-81.665 182.045-182.045-81.665-182.045-182.045-182.045z',
  plus:
    'M810.666667 469.333333h-256V213.333333a42.666667 42.666667 0 0 0-85.333334 0v256H213.333333a42.666667 42.666667 0 0 0 0 85.333334h256v256a42.666667 42.666667 0 0 0 85.333334 0v-256h256a42.666667 42.666667 0 0 0 0-85.333334z',
  minus:
    'M810.666667 554.666667H213.333333a42.666667 42.666667 0 0 1 0-85.333334h597.333334a42.666667 42.666667 0 0 1 0 85.333334z'
};
interface Props {
  type: string,
  style?:object,
  className?: string,
  onClick?: Function
}

export default function Icon(props: Props) {
  const {type, style, className, onClick} = props;
  const iconClass = classNames(`swc-custom-icon swc-custom-icon-${type}`, className);
  function click(ev: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    if (typeof onClick === 'function') {
      ev.stopPropagation();
      onClick(ev);
    }
  }
  return (
    <svg
      viewBox='0 0 1024 1024'
      className={iconClass}
      data-icon={type}
      width='1em'
      height='1em'
      fill='currentColor'
      aria-hidden='true'
      focusable='false'
      style={{display: 'inline-block', ...(style || {})}}
      onClick={click}
    >
      <path d={Path[type]} />
    </svg>
  );
}
