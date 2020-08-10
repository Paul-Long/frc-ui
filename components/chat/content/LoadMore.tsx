import React from 'react';
import classNames from 'classnames';
import {Consumer} from '../common/Hoc';
import {LoadMoreProps} from '../interfaces';
import Loading from '../../loading';

@Consumer()
class LoadMore extends React.PureComponent<LoadMoreProps> {
  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const {loading, total, start, startDate, pageSize, channel, emit, showAllHistory} = this.props;
    if (!emit) return;
    if (loading || total <= start + pageSize) {
      return;
    }
    const payload: any = {
      chatRoomCode: channel,
      startDate: startDate,
      startIndex: start
    };

    if (!showAllHistory) {
      payload.pageSize = pageSize;
    }
    emit('chatMessage.history', payload);
  };
  render() {
    const {prefix, loading, locale, total, start, pageSize, showAllHistory} = this.props;
    let child: any = locale && locale.loadMore;
    if (loading) {
      child = <Loading size={20} />;
    } else if (total <= start + pageSize) {
      child = locale && locale.noLoadMore;
    }
    const className = classNames(`${prefix}-load-more`, {
      [`${prefix}-load-no-more`]: total <= start + pageSize
    });
    return (
      <div className={className} onClick={this.handleClick} style={{display: showAllHistory ? 'none' : 'flex'}}>
        {child}
      </div>
    );
  }
}

export default LoadMore;
