import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import Ac from '@actions';

class Refresh extends React.PureComponent {
  h_click = () => {
    const {refresh} = this.props;
    if (!refresh) {
      Ac.emit('framework.refresh', true);
    }
    let timer = setTimeout(() => {
      clearTimeout(timer);
      if (this.props.refresh) {
        Ac.emit('framework.refresh', false);
      }
    }, 600);
  };

  h_animationEnd = () => {
    Ac.emit('framework.refresh', false);
  };

  render() {
    const {prefix, refresh} = this.props;
    const cls = classNames(`${prefix}-refresh`, {'icon-reload-spin': refresh});
    return (
      <div className={cls} onClick={this.h_click} onAnimationEnd={this.h_animationEnd}>
        <i className='sumscope-icon icon-reload' />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    refresh: state.framework.refresh
  };
}
export default connect(mapStateToProps)(Refresh);
