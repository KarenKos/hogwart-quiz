import React, { PureComponent } from 'react';
import { string, oneOf } from 'prop-types';
import { Container } from './styles';

class Header extends PureComponent {
  render() {
    const { color, text } = this.props;
    return <Container color={color}>{text}</Container>;
  }
}

Header.propTypes = {
  text: string,
  color: oneOf(['default', 'primary']),
};

Header.defaultProps = {
  text: 'Hi World',
  color: 'default',
};

export default Header;
