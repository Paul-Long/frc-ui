import React, {CSSProperties} from 'react';
import classNames from 'classnames';
import Icon from '../icon';

const defaultProps = {
  expanded: false,
  hidden: false
};

export interface SwitcherProps {
  expanded: boolean,
  onChange?: Function,
  hidden?: boolean,
  style?: CSSProperties,
  icon?: Element
}

type DefaultProps = Partial<typeof defaultProps>;
export default function(props: SwitcherProps & DefaultProps) {
  const {expanded, onChange, hidden, style, icon} = props;
  const type = expanded ? 'minus' : 'plus';
  function onClick(ev: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    if (typeof onChange === 'function' && !hidden) {
      onChange(!expanded);
    }
  }
  const cls = classNames('swc-switcher-icon', {
    hidden
  });
  return (<div className={cls} style={style}>{icon || <Icon type={type} onClick={onClick} />}</div>)
}

