import React from 'react';
import {Consumer} from '../common/Hoc';
import {HeaderProps, HeaderState} from '../interfaces';

@Consumer(['count'])
class Header extends React.PureComponent<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      count: props.count || 0
    };
  }

  componentDidMount() {
    const {Socket, channel} = this.props;
    if (Socket) {
      Socket.on(`clients_count_${channel}`, (count: number) => {
        console.log('get you count ', count);
        if (typeof count === 'number') this.setState({count});
      });
    }
  }

  componentWillReceiveProps(nextProps: HeaderProps) {
    if (nextProps.count !== this.props.count) {
      this.setState({count: nextProps.count || 0});
    }
  }

  onlineCount = () => {
    const {count} = this.state;
    const {prefix, locale} = this.props;
    return (
      <div className={`${prefix}-header-count`}>
        <span style={{color: '#7B8082'}}>{`${locale && locale.userCount} : `}</span>
        <span style={{color: '#F9C152'}}>{count}</span>
      </div>
    );
  };
  render() {
    const {prefix} = this.props;
    return <div className={`${prefix}-header`}>{this.onlineCount()}</div>;
  }
}

export default Header;
