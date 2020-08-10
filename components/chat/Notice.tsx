import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/index';
import {Consumer} from './common/Hoc';
import {MessageTypeEnum, NoticeProps, NoticeState} from './interfaces';

@Consumer(['notice'])
class Notice extends React.PureComponent<NoticeProps, NoticeState> {
  constructor(props: NoticeProps) {
    super(props);
    this.state = {
      show: true
    };
  }

  close = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    this.setState({show: false});
  };

  render() {
    const {show} = this.state;
    const {prefix, messageTypes, top, notice, locale} = this.props;
    const cls = `${prefix}-notice`;

    const className = classNames(cls, {
      [`${cls}-hidden`]: !show || !notice || notice === ''
    });

    if (!(messageTypes || []).some((t) => t === MessageTypeEnum.SYSTEM_NOTICE)) return null;

    const style: React.CSSProperties = {top};

    return (
      <div className={className} style={style}>
        <p>{(locale && locale.systemMessage) + ' : ' + (notice || '')}</p>
        <div className={`${cls}-close`} onClick={this.close}>
          <Icon type='close' style={{fontSize: 16}} />
        </div>
      </div>
    );
  }
}

export default Notice;
