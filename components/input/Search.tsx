import React from 'react';
import {InputProps} from 'antd/es/input';
import Input from './Input';
import Icon from '../icon';

export default function(props: InputProps) {
  const prop = {...props};
  const prefix = <Icon style={{color: '#8F9598', fontSize: 'inherit'}} type='search' />;
  prop.prefix = props.prefix || prefix;
  return <Input {...prop} />;
}
