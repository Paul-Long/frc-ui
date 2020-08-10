import React from 'react';
import Modal, {ModalProps} from 'antd/es/modal';
import classNames from 'classnames';

class SWCModal extends React.Component<ModalProps> {
  render() {
    const {wrapClassName, okButtonProps, cancelButtonProps, ...other} = this.props;
    const props: ModalProps = {
      wrapClassName: classNames(wrapClassName, 'swc-modal-wrap'),
      okButtonProps: {...(okButtonProps || {}), className: 'swc-modal-ok'},
      cancelButtonProps: {
        ...(cancelButtonProps || {}),
        className: 'swc-modal-cancel'
      }
    };
    return <Modal {...other} {...props} />;
  }
}

export default SWCModal;
