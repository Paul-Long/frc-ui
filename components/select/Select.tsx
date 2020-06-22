import React from 'react';
import classNames from 'classnames';
import Select, {SelectProps, SelectValue} from 'antd/es/select';
import Icon from '../icon';
import {OptGroup as G, Option as Opt} from 'rc-select';

class SWCSelect<T = SelectValue> extends React.Component<SelectProps, {}> {
  static Option: typeof Opt;

  static OptGroup: typeof G;

  static SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';

  private rcSelect: any;

  saveSelect = (node: any) => {
    this.rcSelect = node;
  };

  focus() {
    this.rcSelect.focus();
  }

  blur() {
    this.rcSelect.blur();
  }

  render() {
    const {className, showSearch, ...other} = this.props;
    const cls = classNames('swc-select', className);
    if (showSearch) {
      other.clearIcon = <Icon className='swc-select-clear' type='close-square' />;
      other.showArrow = false;
      other.allowClear = true;
    }
    return (<Select ref={this.saveSelect} className={cls} showSearch={!!showSearch} {...other} />);
  }
}

export default SWCSelect;