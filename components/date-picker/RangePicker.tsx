import React from 'react';
import classNames from 'classnames';
import DatePicker from 'antd/es/date-picker';
import {RangePickerProps} from 'antd/es/date-picker/interface';

const RangePicker = DatePicker.RangePicker;

class SWCRangePicker extends React.Component<RangePickerProps> {
  render() {
    const {className, dropdownClassName, ...other} = this.props;
    const cls = classNames('swc-range-picker', className);
    const dcn = classNames('swc-calendar-picker-container', dropdownClassName);
    return <RangePicker className={cls} dropdownClassName={dcn} {...other} />;
  }
}

export default SWCRangePicker;
