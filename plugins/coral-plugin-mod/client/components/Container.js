import React from 'react';
import Box from './Box';
import {Button} from 'coral-ui';
import styles from './styles.css';

export default class Footer extends React.Component {
  constructor() {
    super();

    this.state = {
      show: false
    };
  }

  handleClick = () => {
    this.setState((state) => ({
      show: !state.show
    }));
  }

  render() {
    const {show} = this.state;
    return (
      <div className={styles.container}>
        <Button cStyle="darkGrey" onClick={this.handleClick}>
          Show Comment Status
        </Button>
        {show ? <Box comment={this.props.comment} /> : null}
      </div>
    );
  }
}
