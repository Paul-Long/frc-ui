import React from 'react';
import classNames from 'classnames';
import Button, {ButtonProps} from 'antd/es/button';

interface Props extends ButtonProps {
  selected?: boolean;
}

class SWCButton extends React.Component<Props> {
  render() {
    const {className, selected, ...other} = this.props;
    const cls: string = classNames('swc-btn', className, {
      ['swc-btn-selected']: !!selected
    });
    return <Button className={cls} {...other} />;
  }
}

export default SWCButton;
