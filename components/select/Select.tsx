import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Select} from 'antd';
import {SelectProps, SelectValue} from 'antd/es/select'

const {OptGroup, Option, SECRET_COMBOBOX_MODE_DO_NOT_USE} = Select;
class FrcSelect<T = SelectValue> extends React.Component<SelectProps<T>, {}> {
  static Option = Option;
  static OptGroup = OptGroup;
  static SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE;
  static defaultProps: {
    showSearch: boolean;
    transitionName: string;
    choiceTransitionName: string;
  };
  static propTypes: {
    prefixCls: PropTypes.Requireable<string>;
    className: PropTypes.Requireable<string>;
    size: PropTypes.Requireable<"small" | "default" | "large">;
    notFoundContent: PropTypes.Requireable<any>;
    showSearch: PropTypes.Requireable<boolean>;
    optionLabelProp: PropTypes.Requireable<string>;
    transitionName: PropTypes.Requireable<string>;
    choiceTransitionName: PropTypes.Requireable<string>;
    id: PropTypes.Requireable<string>;
  };
  render() {
    const {className, dropdownClassName, notFoundContent, ...other} = this.props;
    const props: any = {
      className: classNames('swc-select', className),
      dropdownClassName: classNames('swc-select-dropdown', dropdownClassName),
      notFoundContent: notFoundContent || 'No Data',
      ...other
    };
    return <Select {...props} />
  }
}
export default FrcSelect;