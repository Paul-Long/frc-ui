import React from 'react';
import {Consumer} from '../common/Hoc';
import {ToolProps} from '../interfaces';
import Emoji from './Emoji';
import Anon from './Anon';

@Consumer()
class Tool extends React.PureComponent<ToolProps> {
  render() {
    const {prefix} = this.props;
    return (
      <div className={`${prefix}-tool`}>
        <Emoji />
        <Anon />
      </div>
    );
  }
}

export default Tool;
