import React from 'react';
import classNames from 'classnames';

interface CollapseProps {
  direction: string,
  collapsed?: boolean,
  className?: string
}
const defaultProps = {
  collapsed: false
};
type DefaultProps = Readonly<typeof defaultProps>;
class CollapseButton extends React.PureComponent<CollapseProps & DefaultProps> {
  f_path = () => {
    const {direction, collapsed} = this.props;
    if (collapsed) {
      switch (direction) {
        case 'left':
          return 'right';
        case 'right':
          return 'left';
        case 'top':
          return 'bottom';
        case 'bottom':
          return 'top';
        default:
          return direction;
      }
    }
    return direction;
  };
  render() {
    const {direction, className, ...other} = this.props;
    delete other.collapsed;
    const cls: string = classNames('swc-collapse-button', `swc-collapse-button-${direction}`, className);
    const path = {
      left: 'M736.4375 1024 224.4375 512 736.4375 0l63.125 63.125L350.7525 512l448.81 448.875L736.4375 1024z',
      right: 'M287.5625 0L799.56249999 512 287.5625 1024l-63.125-63.125L673.2475 512l-448.81-448.875L287.5625 0z',
      top: 'M0 736.4375L512 224.43750001 1024 736.4375l-63.125 63.125L512 350.7525l-448.875 448.81L0 736.4375z',
      bottom: 'M1024 287.5625L512 799.56249999 0 287.5625l63.125-63.125L512 673.2475l448.875-448.81L1024 287.5625z'
    };
    let d = path[this.f_path()];
    return (
      <div {...other} className={cls}>
        <svg
          viewBox='0 0 1024 1024'
          className='swc-collapse-button-arrow'
          width='1em'
          height='1em'
          fill='currentColor'
          aria-hidden='true'
          focusable='false'
        >
          <path d={d} />
        </svg>
      </div>
    )
  }
}
export default CollapseButton;