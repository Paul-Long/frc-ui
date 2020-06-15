import React from 'react';
import {InputProps} from 'antd/es/input';
import Input from './Input';
import Icon from '../icon';

export default function(props: InputProps) {
  const prefix=<Icon style={{color: '#8F9598', fontSize: 'inherit'}} type='search' />;
  props.prefix = props.prefix || prefix;
  return (<Input {...props} />)
}

