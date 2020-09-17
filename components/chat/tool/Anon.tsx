import React from 'react';
import classNames from 'classnames';
import Checkbox from '../../checkbox';
import {Consumer} from '../common/Hoc';
import {AnonProps, AnonState, ChatPermissionEnum, LocalStorageKey} from '../interfaces';
import {getLocalStorageItem, setLocalStorageItem} from '../common';

@Consumer(['isAnonymous', 'permission'])
class Anon extends React.PureComponent<AnonProps, AnonState> {
  anon: boolean = false;
  static defaultProps = {
    isAnonymous: getLocalStorageItem(LocalStorageKey.isAnonymous, 'false') === 'true'
  };

  constructor(props: AnonProps) {
    super(props);
    const {permission} = props;
    this.anon = (permission || []).some((p) => p === ChatPermissionEnum.ANONYMOUS_PERM);
  }


  componentDidMount() {
    const {emit, isAnonymous, channel, permission} = this.props;

    if (isAnonymous && emit) {
      emit('chatMessage.anonymousName', channel);
    }

    this.anon = (permission || []).some((p) => p === ChatPermissionEnum.ANONYMOUS_PERM);
  }

  componentWillReceiveProps(next: AnonProps) {
    if (next.permission && next.permission !== this.props.permission) {
      this.anon = (next.permission || []).some((p) => p === ChatPermissionEnum.ANONYMOUS_PERM);
      this.updateAnon(this.anon);
    }
  }

  updateAnon = (anon: boolean) => {
    const {channel, emit} = this.props;
    if (emit) {
      emit('chat', {isAnonymous: anon});
      anon && emit('chatMessage.anonymousName', channel);
    }
  };

  handleClick = () => {
    const {isAnonymous} = this.props;
    setLocalStorageItem(LocalStorageKey.isAnonymous, isAnonymous ? 'false' : 'true');
    this.updateAnon(!isAnonymous);
  };

  render() {
    const {locale, prefix, className, isAnonymous} = this.props;
    const pre = `${prefix}-tool-anon`;
    const cls = classNames(pre, className);
    const props = {
      className: cls,
      disabled: !this.anon,
      onChange: this.handleClick
    };
    console.log(props);
    return (
      <Checkbox checked={!!isAnonymous} {...props}>
        {locale && locale.anon}
      </Checkbox>
    );
  }
}

export default Anon;
