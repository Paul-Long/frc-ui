import React, {CSSProperties} from 'react';
import classNames from 'classnames';
import Icon from '../components/icon';

interface Props {
  checked: boolean,
  style?: CSSProperties,
  className?: string,
  prefix?: string,
  disabled?: boolean,
  onChange?: Function
}
const defaultProps = {
  checked: false,
  style: {},
  disabled: false,
  prefix: 'swc-checkbox'
};
type DefaultProps = Partial<typeof defaultProps>;
export default function (props: Props & DefaultProps) {
  const {prefix, checked, className, disabled, onChange, style} = props;
  const cls = classNames('swc-checkbox', className, {
    checked: checked,
    [`${prefix}-disabled`]: disabled
  });
  function click(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
    if (typeof onChange === 'function') {
      onChange(!checked);
    }
  }
  let child = null;
  if (checked) child = (<Icon type='checkbox' />);
  return (
    <div
      className={cls}
      onClick={click}
      style={style}
    >
      <span className='swc-checkbox-inner'>{child}</span>
    </div>
  );
}
