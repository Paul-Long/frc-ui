import React from 'react';
import Icon from '../../icon';
import message from '../../message';
import EmojiOne, {EmojiType, UploadType} from '../../emoji-one';
import {Consumer} from '../common/Hoc';
import {EmojiProps, EmojiState, FsType} from '../interfaces';
import uuid from 'uuid';

@Consumer(['uploadEmo', 'cEmoji'])
class Emoji extends React.PureComponent<EmojiProps, EmojiState> {
  constructor(props: EmojiProps) {
    super(props);
    this.state = {
      show: false,
      x: 0,
      y: 0,
      collectEmoji: []
    };
  }

  ele: HTMLDivElement | undefined;

  deleteEmoji: string = '';

  uploadFiles: object = {};

  componentDidMount() {
    const {emit, channel} = this.props;
    if (emit) {
      emit('emoji.list', {
        current: 0,
        size: 30,
        code: channel
      });
    }
  }

  componentWillReceiveProps(nextProps: EmojiProps) {
    const {emit, channel} = nextProps;
    let emoji = [...(this.state.collectEmoji || [])];
    let change: boolean = false;
    if (nextProps.uploadEmo !== this.props.uploadEmo && nextProps.uploadEmo && nextProps.uploadEmo.url) {
      let urls = this.collectEmoji(nextProps.uploadEmo);
      if (urls.length > 0) {
        this.uploadFiles = [];
        urls.forEach((u: any) => {
          if (!emoji.some((e) => e === u)) emoji.push(u);
        });
        emit && emit('emoji.save', {code: channel, url: urls.map((e: any) => e.emojiUrl)});
        change = true;
      }
    }
    if (nextProps.cEmoji !== this.props.cEmoji && nextProps.cEmoji.result) {
      emoji = (nextProps.cEmoji.result || {}).content || [];
    }
    if (change) this.setState({collectEmoji: emoji});
  }

  collectEmoji = (uploadEmo: any) => {
    this.uploadFiles[uploadEmo.payload.fileName] = uploadEmo.url;
    let success = true;
    let uploadUrls: any = [];
    Object.keys(this.uploadFiles).forEach((key) => {
      const value = this.uploadFiles[key];
      if (value) {
        success = false;
      } else {
        uploadUrls.push({emojiUrl: value});
      }
    });

    return success ? uploadUrls : [];
  };

  handleCollectEmo = (data: UploadType) => {
    const {locale} = this.props;
    let illegalFiles = Array.from(data.files || []).filter((file) => {
      return file.size > 512000 || !(file.type || '').startsWith('image/');
    });

    const {collectEmoji} = this.state;
    if (collectEmoji.length + data.files.length > 30) {
      message.info(locale && locale.collectOftenError);
      return;
    }

    if (illegalFiles && illegalFiles.length > 0) {
      message.info(locale && locale.collectFileError);
      return;
    }
    let filesData = Array.from(data.files || []).map((file) => {
      const formData = new FormData();
      let fileName = uuid.v1();
      formData.append('file', file, fileName);
      this.uploadFiles[fileName] = undefined;
      return {
        type: FsType.EMO,
        file: formData,
        fileName: fileName,
        messageKey: data.key
      };
    });

    const {emit} = this.props;
    if (emit) {
      filesData.forEach((data) => {
        emit('chatFile', data);
      });
    }
  };

  onShow = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!this.ele) return;
    const {track} = this.props;
    const rect = this.ele.getBoundingClientRect();
    this.setState({show: true, x: rect.left, y: rect.top});
    if (track) track('聊天室.表情');
  };

  onHide = () => {
    this.setState({show: false});
  };

  onChange = (emo: EmojiType) => {
    const {channel, emit} = this.props;
    if (emo.isDelete) {
      this.deleteEmoji = emo.emo;
      emit && emit('emoji.remove', {url: emo.emo, code: channel});
    } else {
      emit && emit('chat', {emo, id: uuid.v1()});
    }
  };

  ref = (ele: HTMLDivElement) => {
    this.ele = ele;
  };

  render() {
    const {show, x, y, collectEmoji} = this.state;
    const {prefix} = this.props;
    const cls = `${prefix}-tool-emoji`;
    let defaultCollectEmoji: any = [];
    let customCollectEmoji: any = [];
    collectEmoji.forEach((e: any) => {
      return e.default ? defaultCollectEmoji.push(e.emojiUrl) : customCollectEmoji.push(e.emojiUrl);
    });
    return (
      <div className={cls} onClick={this.onShow} ref={this.ref}>
        <Icon type='smile-o' className={`${cls}-icon`} />
        <EmojiOne
          show={show}
          onHide={this.onHide}
          onChange={this.onChange}
          collectEmo={this.handleCollectEmo}
          customEmo={customCollectEmoji}
          defaultEmo={defaultCollectEmoji}
          x={x}
          y={y}
        />
      </div>
    );
  }
}

export default Emoji;
