import React from 'react';
import Icon from '../icon';

export interface Locale {
  back: string;
  edit: string;
}

interface CustomProps {
  locale: Locale;
  sendFile?: Function;
  defaultEmo?: Array<string>;
  emos?: Array<string>;
  onChange?: Function;
  onMouseOut?: Function;
  onMouseOver?: Function;
}

interface CustomState {
  edit: boolean;
}

class Custom extends React.PureComponent<CustomProps, CustomState> {
  constructor(props: CustomProps) {
    super(props);
    this.state = {
      edit: false
    };
  }

  file: React.ReactNode;

  handleEdit = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    const {edit} = this.state;
    this.setState({edit: !edit});
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const {sendFile} = this.props;
    if (sendFile) {
      sendFile(files);
    }
  };

  handleClick = (url: string) => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(url, this.state.edit);
    }
  };

  handleMouseOut = (url: string) => {
    const {onMouseOut} = this.props;
    if (onMouseOut) {
      onMouseOut(url);
    }
  };

  handleMouseOver = (url: string, index: number) => {
    const {onMouseOver} = this.props;
    if (onMouseOver) {
      onMouseOver(url, index);
    }
  };

  saveRef = (ele: React.ReactNode) => {
    this.file = ele;
  };

  renderDefaultEmo = () => {
    const {defaultEmo} = this.props;
    let index = 0;
    return (defaultEmo || []).map((emo) => {
      return (
        <li key={'emo-' + emo}>
          <a
            onMouseOver={this.handleMouseOver.bind(this, emo, index++)}
            onMouseOut={this.handleMouseOut.bind(this, emo)}
            onClick={this.handleClick.bind(this, emo)}
          >
            <img className='emo-thumbnail' src={emo + '?width=36'} />
          </a>
        </li>
      );
    });
  };

  renderDelete = (url: string) => {
    const {edit} = this.state;
    const props = {
      className: 'emoji-delete',
      onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        this.handleClick(url);
      }
    };
    if (edit) {
      return (
        <a {...props}>
          <i className='icon-font delete' />
          <Icon type='delete' />
        </a>
      );
    }
    return null;
  };

  renderEmo = () => {
    const {defaultEmo, emos} = this.props;
    let index = defaultEmo ? defaultEmo.length : 0;
    return (emos || []).map((emo) => {
      return (
        <li key={'emo-' + emo}>
          <a
            onMouseOver={this.handleMouseOver.bind(this, emo, index++)}
            onMouseOut={this.handleMouseOut.bind(this, emo)}
            onClick={this.handleClick.bind(this, emo)}
          >
            <img className='emo-thumbnail' src={emo + '?width=36'} />
          </a>
          {this.renderDelete(emo)}
        </li>
      );
    });
  };

  renderAdd = () => {
    return this.state.edit ? (
      ''
    ) : (
      <li key='emo-add'>
        <a
          className='file'
          onClick={(event) => {
            event.stopPropagation();
            if (this.file) this.file['value'] = '';
          }}
        >
          <Icon type='plus' />
          <input
            ref={this.saveRef}
            type='file'
            multiple
            accept='image/gif, image/jpg,image/jpeg,image/png'
            onChange={this.handleChange}
          />
        </a>
      </li>
    );
  };

  render() {
    const {locale} = this.props;
    const {edit} = this.state;
    const pre = 'frc-emoji-custom';
    return (
      <div className={pre}>
        {this.renderDefaultEmo()}
        {this.renderEmo()}
        {this.renderAdd()}
        <div className={`${pre}-edit`} onClick={this.handleEdit}>
          {edit ? locale.back : locale.edit}
        </div>
      </div>
    );
  }
}

export default Custom;
