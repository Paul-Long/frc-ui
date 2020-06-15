import React from 'react';
import classNames from 'classnames';
import Radio from 'antd/es/radio';
import RadioGroup from 'antd/es/radio/group';
import RadioButton from 'antd/es/radio/radioButton';
import {RadioProps} from 'antd/es/radio/interface';

class SWCRadio extends React.PureComponent<RadioProps> {
  static Group: typeof RadioGroup;
  static Button: typeof RadioButton;
  render() {
    const {className, ...other} = this.props;
    const prop: RadioProps ={
      className: classNames(className, 'swc-radio')
    };
    return (<Radio {...other} {...prop} />)
  }
}

export default SWCRadio;
