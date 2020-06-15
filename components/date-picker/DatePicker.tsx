import React from 'react';
import classNames from 'classnames';
import DatePicker from 'antd/es/date-picker';
import {DatePickerProps} from 'antd/es/date-picker/interface';
import RangePicker from './RangePicker';

class SWCDatePicker extends React.Component<DatePickerProps> {
  static RangePicker: typeof RangePicker;
  render() {
    const {className, dropdownClassName, ...other} = this.props;
    const cls = classNames('swc-calendar-picker', className);
    const dcn = classNames('swc-calendar-picker-container', dropdownClassName);
    return (
      <DatePicker className={cls} dropdownClassName={dcn} {...other} />
    );
  }
}
export default SWCDatePicker;