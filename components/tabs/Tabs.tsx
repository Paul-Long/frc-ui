import React from 'react';
import classNames from 'classnames';
import Radio, {RadioChangeEvent} from 'antd/es/radio';

const {Group, Button} = Radio;
type OptionProps = {label: string, value: string | number, disabled?: boolean, color?: string, background?: string, width?: number, render?: Function};

interface TabsProps {
  className?: string,
  onChange?: Function,
  showAll?: boolean,
  multi?: boolean,
  value?: string | number | Array<string | number>,
  options: Array<OptionProps>,
  children?: any,
  itemWidth?: number,
  label?: string
}

interface TabsState {
  value?: string | number | Array<string | number>,
}

class Tabs extends React.PureComponent<TabsProps, TabsState> {
  static defaultProps = {
    showAll: false,
    multi: false,
    itemWidth: 60
  };

  constructor(props: any) {
    super(props);
    const {showAll, multi} = props;
    let value = props.value;
    if (showAll && !value) {
      value = value || (multi ? ['all'] : 'all');
    }
    this.state = {
      value
    };
  }

  componentWillReceiveProps(nextProps: TabsProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({value: nextProps.value});
    }
  }

  h_change = (ev: RadioChangeEvent) => {
    const {multi, onChange, options, showAll} = this.props;
    let stateValue = this.state.value;
    let value = ev.target.value;
    if (value === undefined) return;
    const disabled = options.some(o => o.value === value && o.disabled === true);
    if (disabled) return;
    if (multi) {
      if (!!ev.nativeEvent.ctrlKey) {
        if (value === 'all') {
          value = ['all'];
        } else {
          const sv = stateValue || [];
          if (sv instanceof Array) {
            if (!sv.some(va => va === value)) {
              value = [...sv.filter(v => v !== 'all'), value];
            } else {
              value = sv.filter(v => v !== value);
            }
          }
        }
        if (showAll) {
          const sa = options.some(o => !o.disabled && value.indexOf(o.value) < 0);
          if (!sa || value.length === 0) {
            value = ['all'];
          }
        }
      } else {
        value = [value];
      }
    }
    this.setState({value}, () => {
      if (typeof onChange === 'function') {
        onChange(value, ev.target.value);
      }
    });
  };

  f_checked = (v: string | number) => {
    const {value} = this.state;
    const vs = value || [];
    return (vs instanceof Array && vs.some(va => va === v)) || value === v;
  };

  r_button = () => {
    const {showAll} = this.props;
    let options = this.props.options || [];
    if (showAll) {
      const all = {label: '全部', value: 'all'};
      options = [all, ...options];
    }
    return (options || []).map(o => {
      const style: React.CSSProperties = {minWidth: this.props.itemWidth};
      const checked = this.f_checked(o.value);
      checked && (style.background = '#FF9300');
      checked && (style.color = '#1E1E1E');
      o.width && (style.width = o.width);
      (checked && o.background) && (style.background = o.background);
      (checked && o.color) && (style.color = o.color);
      const cls = classNames({
        ['swc-tabs-checked']: checked,
        ['swc-tabs-disabled']: o.disabled
      });
      if (typeof o.render === 'function') {
        const props: any = {
          style,
          className: cls,
          children: o.label
        };
        return o.render(Button, props);
      }
      return <Button key={o.value} style={style} value={o.value} className={cls} checked={false}>{o.label}</Button>;
    });
  };

  render() {
    const {className, children, label, ...other} = this.props;
    const {value} = this.state;
    delete other.onChange;
    delete other.value;
    delete other.options;
    const cls = classNames('swc-tabs', className);
    const child = (
      <Group  {...other} className={cls} onChange={this.h_change} value={value}>
        {children || this.r_button()}
      </Group>
    );
    if (label) {
      return (
        <div className='swc-tabs-wrapper'>
          <label>{label}:</label>
          {child}
        </div>
      );
    }
    return child;
  }
}

export default Tabs;
