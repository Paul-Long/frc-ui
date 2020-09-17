import React, {CSSProperties} from 'react';
import classNames from 'classnames';
import Icon from '../components/icon';

interface Props {
  checked: boolean;
  style?: CSSProperties;
  className?: string;
  prefix?: string;
  disabled?: boolean;
  onChange?: Function;
  children?: any;
}

interface State {
  value: boolean;
}

class Checkbox extends React.PureComponent<Props, State> {
  static defaultProps = {
    checked: false,
    style: {},
    disabled: false,
    prefix: 'swc-checkbox'
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.checked
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({value: nextProps.checked});
    }
  }

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {disabled, onChange} = this.props;
    const {value} = this.state;
    event.stopPropagation && event.stopPropagation();
    this.setState({value: !value}, () => {
      if (typeof onChange === 'function' && !disabled) {
        onChange(!value);
      }
    });
  };

  render() {
    const {prefix: pre, className, disabled, style, children} = this.props;
    const {value} = this.state;
    const prefix = pre || 'swc-checkbox';
    const cls = classNames('swc-checkbox', className, {
      checked: value,
      [`${prefix}-child`]: !!children,
      [`${prefix}-disabled`]: disabled
    });
    let child = null;
    if (value) child = <Icon type='checkbox' />;
    return (
      <div className={cls} onClick={this.onClick} style={style}>
        <span className='swc-checkbox-inner'>{child}</span>
        {children}
      </div>
    );
  }
}

export default Checkbox;
