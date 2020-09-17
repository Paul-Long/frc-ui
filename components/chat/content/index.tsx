import React from 'react';
import moment from 'moment';
import {Consumer} from '../common/Hoc';
import {ContentProps, ContentState} from '../interfaces';
import MessageTip from './MessageTip';
import Message from './Message';
import LoadMore from './LoadMore';

@Consumer(['historyMessage'])
class Content extends React.PureComponent<ContentProps, ContentState> {
  body?: HTMLDivElement;

  total: number = 0;

  pageSize: number = 10;

  socketMessage: any;

  auto: boolean = true;

  startDate: string = moment()
    .subtract(15, 'd')
    .format('YYYY-MM-DD');
  constructor(props: ContentProps) {
    super(props);
    this.state = {
      chatMessage: []
    };
    if (props.historyStateDate) {
      this.startDate = props.historyStateDate;
    }
  }

  componentDidMount() {
    const {Socket, channel} = this.props;
    this.load();
    if (Socket) {
      Socket.on(`${channel}_message`, (message: any) => {
        const {chatMessage} = this.state;

        if (message) {
          this.socketMessage = message;
          const tmp = [...(chatMessage || []), message];
          tmp.sort(function(a: any, b: any) {
            return a.time - b.time;
          });
          this.setState({chatMessage: tmp});
        }
      });
    }
  }

  componentWillReceiveProps(nextProps: ContentProps) {
    const {chatMessage} = this.state;
    if (nextProps.historyMessage !== this.props.historyMessage) {
      if (nextProps.historyMessage.success) {
        const pageInfo = nextProps.historyMessage.pageInfo;
        this.total = (pageInfo || {}).totalSize || 0;
        const result = (nextProps.historyMessage.result || []).filter(
          (h: any) => !(chatMessage || []).some((c) => c.id === h.id)
        );
        const tmp = [...(chatMessage || []), ...result];
        tmp.sort(function(a: any, b: any) {
          return a.time - b.time;
        });
        this.setState({chatMessage: tmp});
      }
    }
  }

  componentDidUpdate() {
    if (this.auto && this.body) this.body.scrollTop = this.body.scrollHeight;
  }

  load = () => {
    const {channel, emit, showAllHistory} = this.props;
    if (!emit) return;
    const payload: any = {
      chatRoomCode: channel,
      startDate: this.startDate,
      startIndex: 0
    };

    if (!showAllHistory) {
      payload.pageSize = this.pageSize;
    }

    emit('chatMessage.history', payload);
  };

  scroll = () => {
    if (!this.body) return;
    const top = this.body.scrollTop + this.body.clientHeight;
    const auto = top > this.body.scrollHeight - 5 && top < this.body.scrollHeight + 5;
    if (auto) this.socketMessage = null;
    this.auto = auto;
  };

  saveRef = (name: string) => (ele: any) => {
    this[name] = ele;
  };

  renderBody = () => {
    const {chatMessage} = this.state;
    return chatMessage.map((m: any) => {
      return <Message key={m.id} data={m} />;
    });
  };

  render() {
    const {prefix, historyMessage, locale} = this.props;
    const {chatMessage} = this.state;
    const cls = `${prefix}-content`;
    return (
      <div className={cls}>
        <div className={`${cls}-list`} ref={this.saveRef('body')} onScroll={this.scroll}>
          <LoadMore
            start={chatMessage.length}
            pageSize={this.pageSize}
            loading={!!historyMessage.loading}
            total={this.total}
            startDate={this.startDate}
          />
          {this.renderBody()}
        </div>
        <MessageTip prefix={cls} message={this.socketMessage} show={!this.auto} onClick={this.scroll} locale={locale} />
      </div>
    );
  }
}

export default Content;
