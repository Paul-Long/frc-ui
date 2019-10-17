import React from 'react';
import Header from './Header';

interface FrameworkProps {
  prefix?: string
}
const defaultProps = {
  prefix: 'ss-framework'
};
type DefaultProps = Readonly<typeof defaultProps>;
class Framework extends React.PureComponent<FrameworkProps & DefaultProps> {
  render() {
    const {prefix} = this.props;
    return (
      <div className={prefix}>
        <Header prefix={prefix} renderRight={() => ''} title={'SMS'} />
        {/*<Content prefix={prefix}>{children}</Content>*/}
      </div>
    )
  }
}

export default Framework;