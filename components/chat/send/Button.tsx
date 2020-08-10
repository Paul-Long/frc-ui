import React from 'react';
import ReactDOM from 'react-dom';
import {ChatPermissionEnum, LocalStorageKey, SendButtonProps, SendButtonState} from '../interfaces';
import Icon from '../../icon';
import {Consumer} from '../common/Hoc';
import {isExistedListContainer, createListContainer, getPosElement, listContainer} from '../common/dom';
import {getLocalStorageItem, setLocalStorageItem} from '../common';

@Consumer(['permission'])
class Button extends React.PureComponent<SendButtonProps, SendButtonState> {
  constructor(props: SendButtonProps) {
    super(props);
    this.state = {
      shortcutKey: getLocalStorageItem(LocalStorageKey.shortcutKey, 'EnterSend')
    };
  }

  onOptionSelected = (shortcutKey: string) => () => {
    this.setState({shortcutKey});
    setLocalStorageItem(LocalStorageKey.shortcutKey, shortcutKey);
    this.showListContainer(false);
  };

  showListContainer = (showTabFlag: boolean) => {
    const {prefix, locale} = this.props;

    const options = [
      {code: 'EnterSend', name: locale && locale.EnterSend},
      {code: 'CtrlEnterSend', name: locale && locale.CtrlEnterSend}
    ];

    let container: any = <div className='hidden' />;
    if (!isExistedListContainer()) {
      createListContainer();
    }
    if (showTabFlag) {
      let ops = options.map((d) => {
        return (
          <li key={d.code} onMouseDown={this.onOptionSelected(d.code)}>
            {d.name}
            {d.code === this.state.shortcutKey ? <Icon type='check' /> : ''}
          </li>
        );
      });
      const parentRect = getPosElement(this.refs.container);
      const style: React.CSSProperties = {};
      style.left = parentRect.left - 190 + parentRect.width;
      style.top = parentRect.top - 54;
      style.width = 190;
      if (this.props.channel === 'credBChat') {
        style.top = parentRect.top + parentRect.height + 1 - 54 - 24;
      }
      container = (
        <div className={`${prefix}-send-btn-wrap`} style={style}>
          <ul className={`${prefix}-send-btn-list`}>{ops}</ul>
        </div>
      );
    }
    ReactDOM.render(container, listContainer);
  };

  handleIconClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.showListContainer(true);
    event.stopPropagation();
  };

  handleBlur = () => {
    this.showListContainer(false);
  };

  handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    const {onClick} = this.props;
    onClick();
  };

  render() {
    const {prefix, locale, permission} = this.props;
    const isAnon = (permission || []).some((p) => p === ChatPermissionEnum.ANONYMOUS_PERM);
    const name = locale && (isAnon ? locale.anonSendText : locale.sendText);
    const cls = `${prefix}-send-btn`;
    return (
      <div className={cls} ref='container'>
        <div className={`${cls}-content`} onClick={this.handleClick}>
          {name}
        </div>
        <div className={`${cls}-icon`} onClick={this.handleIconClick} onBlur={this.handleBlur} tabIndex={-1}>
          <Icon type='down' style={{fontSize: 12}} />
        </div>
      </div>
    );
  }
}

export default Button;
