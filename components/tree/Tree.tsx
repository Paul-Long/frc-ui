import React, {CSSProperties} from 'react';
import classNames from 'classnames';
import Item from './Item';
import {Insert_Type, OptionProps, Props, Render_Type, Scroll_Type, State} from './types';

class Tree extends React.PureComponent<Props, State> {
  static defaultProps = {
    prefix: 'swc-tree',
    options: [],
    selectedKeys: [],
    expandedKeys: [],
    rowHeight: 22,
    fixedTopBottom: true,
    clickRow: true
  };
  showColorKeys: Array<string | number> = [];
  wrap?: HTMLDivElement;
  type: Scroll_Type = Scroll_Type.ALL;
  showCount: number = 0;

  constructor(props: Props) {
    super(props);
    this.showColorKeys = this.getSelectedPath(props.selectedKeys || [], props.options);
    this.state = {
      selectedKeys: props.selectedKeys || [],
      expandedKeys: props.expandedKeys || [],
      tops: [],
      options: [],
      bottoms: [],
      width: 100,
      height: 100
    };
  }

  componentWillMount() {
    this.setState({options: this.getOptions()});
  }

  componentDidMount() {
    if (this.wrap) {
      this.resize();
      this.wrap.addEventListener('resize', this.resize);
    }
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps: Props) {
    let state: State = {};
    if (nextProps.selectedKeys !== this.props.selectedKeys) {
      state.selectedKeys = nextProps.selectedKeys || [];
      this.showColorKeys = this.getSelectedPath(state.selectedKeys, nextProps.options);
    }
    if (nextProps.expandedKeys !== this.props.expandedKeys) {
      state.expandedKeys = nextProps.expandedKeys || [];
    }
    if (nextProps.options !== this.props.options) {
      state.tops = [];
      state.bottoms = [];
      state.options = this.getOptions(state.expandedKeys || this.state.expandedKeys, nextProps.options);
      state = {...state, ...this.update(state.options)};
      if (Object.prototype.hasOwnProperty.call(state, 'selectedKeys')) {
        this.showColorKeys = this.getSelectedPath(state.selectedKeys || [], nextProps.options);
      } else {
        this.showColorKeys = this.getSelectedPath(this.state.selectedKeys || [], nextProps.options);
      }
    } else {
      if (!!state.expandedKeys) {
        state.options = this.getOptions(state.expandedKeys);
        state = {...state, ...this.update(state.options)};
      }
    }
    if (Object.keys(state).length > 0) {
      this.setState(state, this.resize);
    }
  }

  resize = () => {
    const {rowHeight, fixedTopBottom} = this.props;
    const {tops, options, bottoms} = this.state;
    if (this.wrap && fixedTopBottom) {
      const height = this.wrap.clientHeight;
      const width = this.wrap.clientWidth;
      if (width !== this.state.width || height !== this.state.height) {
        this.setState({width, height});
      }
      const length = (options || []).length + (tops || []).length + (bottoms || []).length;

      let type;
      if (length * rowHeight < height) {
        type = Scroll_Type.ALL;
      } else {
        type = Scroll_Type.CONTAINER;
      }
      if (type !== this.type || this.showCount !== (options || []).length) {
        this.showCount = (options || []).length;
        this.type = type;
        const opts: any = this.update(this.getOptions());
        this.setState(opts);
      }
    }
  };

  getProps = (prop: string) => {
    return this.props[prop];
  };

  saveRef = (name: string) => (ele: HTMLDivElement) => {
    this[name] = ele;
  };
  update = (options: Array<OptionProps> = []) => {
    const {rowHeight} = this.props;
    const {height} = this.state;
    if (height && (options.length * rowHeight > height)) {
      this.type = Scroll_Type.CONTAINER;
    } else {
      this.type = Scroll_Type.ALL;
    }
    if (this.type !== Scroll_Type.CONTAINER) {
      return {tops: [], bottoms: [], options};
    }
    const tops: Array<OptionProps> = [], opts: Array<OptionProps> = [], bottoms: Array<OptionProps> = [];
    let start: Insert_Type = Insert_Type.TOP;
    for (let i = 0; i < options.length; i++) {
      const o = options[i];
      if (o.index === 0) {
        if (start === Insert_Type.TOP) {
          tops.push(o);
        } else {
          start = Insert_Type.BOTTOM;
          bottoms.push(o);
        }
      } else {
        start = Insert_Type.MIDDLE;
        opts.push(o);
      }
    }
    return {tops, options: opts, bottoms};
  };
  onChange = (option: OptionProps) => {
    return (type: string, flag: boolean) => {
      const {rowHeight, onChange, onExpand} = this.props;
      const {height} = this.state;
      const selectedKeys = this.state.selectedKeys || [];
      const expandedKeys = this.state.expandedKeys || [];
      const {value} = option;
      let keys: Array<string | number>;
      switch (type) {
        case 'check':
          keys = selectedKeys;
          if (flag) {
            if (keys.indexOf(value) < 0) {
              keys = [...selectedKeys, value];
            }
          } else {
            keys = selectedKeys.filter((v: string | number) => v !== value);
          }
          this.showColorKeys = this.getSelectedPath(keys);
          this.setState({selectedKeys: keys}, () => {
            if (typeof onChange === 'function') {
              onChange(keys || [], option);
            }
          });
          break;
        case 'expand':
          keys = expandedKeys;
          if (flag) {
            if (keys.indexOf(value) < 0) {
              keys = [...expandedKeys, value];
            }
          } else {
            const cKeys = this.expandKeys(value);
            keys = keys.filter((v: string | number) => (cKeys.indexOf(v) < 0));
          }
          let options: Array<OptionProps> = this.getOptions(keys);
          if (height && options.length * rowHeight > height) {
            const childKeys = this.getChildKeys(option.index === 0 ? option.value : option.parent);
            keys = keys.filter(k => childKeys.indexOf(k) > -1);
          }
          options = this.getOptions(keys);
          const opts = this.update(options);
          this.setState({expandedKeys: keys, ...opts}, () => {
            if (typeof onExpand === 'function') {
              onExpand(keys || [], option);
            }
          });
          break;
      }
    };
  };

  getChildKeys = (value: string | number, options: Array<OptionProps> = this.props.options, keys: Array<string | number> = [], flag: boolean = false) => {
    for (let i = 0; i < options.length; i++) {
      const option: OptionProps = options[i];
      if (option.value === value || flag) {
        keys.push(option.value);
        const children: Array<OptionProps> = option.children || [];
        if (children.length > 0) {
          keys = this.getChildKeys(value, children, keys, true);
        }
      }
    }
    return keys;
  };

  expandKeys = (value: string | number, options: Array<OptionProps> = this.props.options, keys: Array<string | number> = [], found: boolean = false) => {
    options.forEach(o => {
      const children = o.children || [];
      if (children.length > 0) {
        if (o.value === value || found) {
          keys.push(o.value);
        }
        keys = this.expandKeys(value, children, keys, o.value === value || found);
      }
    });
    return keys;
  };

  getSelectedPath = (
    selectedKeys: Array<string | number>,
    options: Array<OptionProps> = this.props.options,
    keys: Array<string | number> = []
  ) => {
    options.forEach(o => {
      const children = o.children || [];
      if (children.length > 0) {
        this.getSelectedPath(selectedKeys, children, keys);
      }
      if (selectedKeys.indexOf(o.value) > -1 || children.some(c => keys.indexOf(c.value) > -1)) {
        keys.push(o.value);
      }
    });
    return keys;
  };

  getOptions = (
    expandedKeys: Array<string | number> = this.state.expandedKeys || [],
    options: Array<OptionProps> = this.props.options,
    opt: Array<OptionProps> = [],
    index = 0,
    parentExpanded: boolean = true,
    parent: string | number = ''
  ) => {
    options = options || [];
    const expandPlace = options.some(o => (o.children && o.children.length > 0));
    options.forEach(o => {
      const {children, ...other} = o;
      const expandEnable = children && children.length > 0;
      const one = {expandEnable, ...other, index, expandPlace, parent};
      const expanded = expandEnable && expandedKeys.indexOf(o.value) > -1;
      if (index === 0) parent = o.value;
      if (parentExpanded) {
        opt.push(one);
      }
      if (expandEnable) {
        this.getOptions(expandedKeys, children || [], opt, index + 1, expanded, parent);
      }
    });
    return opt;
  };

  getStyle = (type: Render_Type) => {
    const {rowHeight} = this.props;
    const opts: Array<OptionProps> = this.state[type.toString()];
    const style: CSSProperties = {};
    if (opts.length <= 0) {
      style.display = 'none';
      return style;
    }
    style.height = opts.length * rowHeight;
    return style;
  };

  renderItem = (type: Render_Type) => {
    const {prefix, rowHeight, clickRow} = this.props;
    const options: Array<OptionProps> = this.state[type.toString()];
    const {selectedKeys, expandedKeys, width} = this.state;
    return options.map(o => {
      return (
        <Item
          key={`${o.value}-${o.index}`}
          prefix={prefix}
          option={o}
          clickRow={clickRow}
          parentWidth={width || 100}
          rowHeight={rowHeight || 22}
          hasSelected={this.showColorKeys.indexOf(o.value) > -1}
          expanded={(expandedKeys || []).indexOf(o.value) > -1}
          checked={(selectedKeys || []).indexOf(o.value) > -1}
          onChange={this.onChange(o)}
        />
      );
    });
  };

  render() {
    const {className, prefix} = this.props;
    const cls = classNames(`${prefix}`, className);
    const fixedTop = `${prefix}-fixed-top`;
    const fixedBottom = `${prefix}-fixed-bottom`;
    const topStyle: CSSProperties = this.getStyle(Render_Type.tops);
    const bottomStyle: CSSProperties = this.getStyle(Render_Type.bottoms);
    const containerStyle: CSSProperties = {};
    const innerStyle: CSSProperties = {};
    if (this.type === Scroll_Type.CONTAINER) {
      innerStyle.height = '100%';
      innerStyle.overflowY = 'hidden';
      innerStyle.paddingTop = topStyle.height || 0;
      innerStyle.paddingBottom = bottomStyle.height || 0;
      containerStyle.overflowY = 'auto';
      containerStyle.height = '100%';
    }
    return (
      <div className={cls} ref={this.saveRef('wrap')}>
        <div className={`${prefix}-inner`} style={innerStyle}>
          <div className={fixedTop} style={topStyle}>{this.renderItem(Render_Type.tops)}</div>
          <div className={`${prefix}-container`} style={containerStyle}>
            {this.renderItem(Render_Type.options)}
          </div>
          <div className={fixedBottom} style={bottomStyle}>{this.renderItem(Render_Type.bottoms)}</div>
        </div>
      </div>
    );
  }
}

export default Tree;