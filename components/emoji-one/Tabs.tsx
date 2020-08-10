import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import Cover from '../cover';
import Custom, {Locale} from './Custom';
import EmojiOne from './EmojiOne';
import {EmojiType} from './types';

interface TabsProps {
  show: boolean;
  onHide?: Function;
  locale?: Locale;
  collectEmo?: Function;
  messageKey?: string;
  onChange?: Function;
  x?: number;
  y?: number;
  customEmo?: Array<string>;
  defaultEmo?: Array<string>;
}
interface TabsState {
  tab: string;
}

enum Tab {
  EMOJI = 'emoji',
  CUSTOM = 'custom'
}

class Tabs extends React.PureComponent<TabsProps, TabsState> {
  static defaultProps = {
    locale: {
      back: '返回',
      edit: '编辑'
    }
  };
  constructor(props: TabsProps) {
    super(props);
    this.state = {
      tab: Tab.EMOJI
    };
  }

  handleChange = (tab: string) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    this.setState({tab});
  };

  handleHidden = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {onHide} = this.props;
    event.stopPropagation();
    if (onHide) onHide();
  };

  handleSendFile = (files?: Array<File>) => {
    const {collectEmo, messageKey} = this.props;
    if (collectEmo)
      collectEmo({
        key: messageKey,
        files
      });
  };

  handleClick = (emo: EmojiType) => {
    const {onChange} = this.props;
    if (onChange) onChange(emo);
  };

  handleStop = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  renderChildren = () => {
    const {locale, customEmo, defaultEmo} = this.props;
    const {tab} = this.state;
    switch (tab) {
      case Tab.CUSTOM:
        return (
          <Custom
            emos={customEmo || []}
            defaultEmo={defaultEmo || []}
            locale={locale || {back: '返回', edit: '编辑'}}
            sendFile={this.handleSendFile}
            onChange={(url: string, isDelete: boolean) => this.handleClick({emo: url, type: 'collectEmo', isDelete})}
          />
        );
      default:
        return <EmojiOne onChange={this.handleClick} />;
    }
  };

  render() {
    const {tab} = this.state;
    const {show, x, y} = this.props;
    const pre = 'frc-emoji-tabs';
    return (
      <Cover show={show} onClick={this.handleHidden}>
        <div className={pre} style={{top: y ? y - 312 - 2 : 0, left: x || 0}} onClick={this.handleStop}>
          {this.renderChildren()}
          <div className={`${pre}-bottom`}>
            <div
              className={classNames(`${pre}-tab`, {[`${pre}-tab-selected`]: tab === Tab.EMOJI})}
              onClick={this.handleChange(Tab.EMOJI)}
            >
              <Icon type='smile-o' />
            </div>
            <div
              className={classNames(`${pre}-tab`, {[`${pre}-tab-selected`]: tab === Tab.CUSTOM})}
              onClick={this.handleChange(Tab.CUSTOM)}
            >
              <Icon type='star' />
            </div>
          </div>
        </div>
      </Cover>
    );
  }
}

export default Tabs;
