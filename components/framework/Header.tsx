import React from 'react';
interface HeaderProps {
  prefix: string,
  title?: string | Function,
  renderRight?: Function
}

const defaultProps = {
  title: '',
  renderRight: (props: any) => ''
};
type DefaultProps = Readonly<typeof defaultProps>;
class Header extends React.PureComponent<HeaderProps & DefaultProps> {
  render() {
    const {prefix, title, renderRight} = this.props;
    const pf = `${prefix}-header`;
    let titleNode = title;
    if (typeof title === 'function') {
      titleNode = title({prefix});
    }
    return (
      <div className={pf}>
        <span className={`${pf}-ico`}>{titleNode}</span>
        <div className={`${pf}-right`}>
          {renderRight({prefix})}
        </div>
      </div>
    )
  }
}

export default Header;