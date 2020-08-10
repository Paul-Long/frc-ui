import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface CoverProps {
  stopPrevent?: boolean;
  onClick?: Function;
  className?: string;
  show: boolean;
}

class Cover extends React.PureComponent<CoverProps> {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    show: PropTypes.bool,
    className: PropTypes.string,
    stopPrevent: PropTypes.bool
  };
  static defaultProps = {
    show: false,
    stopPrevent: true
  };
  handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (this.props.stopPrevent) {
      e.preventDefault();
      const {onClick} = this.props;
      if (typeof onClick === 'function') {
        onClick(e);
      }
    }
  };

  render() {
    const {className, children, show} = this.props;
    const props = {
      className: classNames([className, 'frc-cover']),
      onClick: this.handleClick,
      style: {display: show ? '' : 'none'}
    };
    return <div {...props}>{children}</div>;
  }
}

export default Cover;
