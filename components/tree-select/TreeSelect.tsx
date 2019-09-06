import React from 'react';
import classNames from 'classnames';
import {TreeSelect} from 'antd';
import {TreeSelectProps, TreeNodeValue} from 'antd/es/tree-select/interface';

const {TreeNode} = TreeSelect;
class FrcTreeSelect<T extends TreeNodeValue> extends React.Component<TreeSelectProps<T>, any> {
  static TreeNode = TreeNode;
  static SHOW_ALL = TreeSelect.SHOW_ALL;
  static SHOW_PARENT = TreeSelect.SHOW_PARENT;
  static SHOW_CHILD = TreeSelect.SHOW_CHILD;
  static defaultProps: {
    transitionName: string;
    choiceTransitionName: string;
  };
  render() {
    const {className, ...other} = this.props;
    const props: any = {
      className: classNames('swc-tree-select', className),
      ...other
    };
    return (
      <TreeSelect {...props} />
    )
  }
}

export default FrcTreeSelect;