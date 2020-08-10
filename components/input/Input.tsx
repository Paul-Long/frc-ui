import React from 'react';
import classNames from 'classnames';
import Input, {InputProps} from 'antd/es/input';
import Search from './Search';
import Icon from '../icon';

export interface InputState {
  value: any;
  showClear: boolean;
  focus: boolean;
}
class SInput extends React.Component<InputProps, InputState> {
  input: any;
  timer: any;
  clearing: boolean = false;
  static Search: typeof Search;
  static TextArea: typeof Input.TextArea;
  constructor(props: InputProps) {
    super(props);
    this.state = {
      value: props.value,
      showClear: false,
      focus: false
    };
  }

  componentWillReceiveProps(nextProps: InputProps) {
    const props = this.props;
    if (nextProps.value !== props.value) {
      this.setState({value: nextProps.value});
    }
  }

  setValue(
    value: string,
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement, MouseEvent>,
    callback?: () => void
  ) {
    if (!('value' in this.props)) {
      this.setState({value}, callback);
    }
    const {onChange} = this.props;
    if (onChange) {
      let event = e;
      if (e.type === 'click') {
        // click clear icon
        event = Object.create(e);
        event.target = this.input;
        event.currentTarget = this.input;
        const originalInputValue = this.input.value;
        // change input value cause e.target.value should be '' when clear input
        this.input.value = '';
        onChange(event as React.ChangeEvent<HTMLInputElement>);
        // reset input value
        this.input.value = originalInputValue;
        return;
      }
      onChange(event as React.ChangeEvent<HTMLInputElement>);
    }
  }

  handleClear = (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.clearing = true;
    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.clearing = false;
      this.input.focus();
    }, 100);
    this.setValue('', ev, () => {
      this.input.focus();
    });
  };

  handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setValue(ev.target.value, ev);
  };

  onFocus = (ev: any) => {
    const {onFocus} = this.props;
    typeof onFocus === 'function' && onFocus(ev);
    this.setState({focus: true});
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  };

  onBlur = (ev: any) => {
    if (this.clearing) return ev;
    const {onBlur} = this.props;
    typeof onBlur === 'function' && onBlur(ev);
    this.timer = setTimeout(() => {
      this.setState({focus: false});
    }, 100);
  };

  saveInput = (node: any) => {
    this.input = node;
  };

  render() {
    const {value, focus} = this.state;
    let cls: string = 'swc-input';
    const {className, allowClear, ...other} = this.props;
    cls = classNames(cls, className, {
      [`${cls}-focus`]: focus
    });
    if (allowClear && focus) {
      const iconClass = classNames('swc-input-clear', {
        ['swc-input-clear-focus']: focus
      });
      other.suffix = (
        <span onMouseDown={this.handleClear}>
          <Icon className={iconClass} type='close-square' style={{fontSize: 'inherit'}} />
        </span>
      );
    }
    other.value = value;
    other.onChange = this.handleChange;
    other.onBlur = this.onBlur;
    other.onFocus = this.onFocus;
    return <Input ref={this.saveInput} className={cls} {...other} />;
  }
}

export default SInput;
