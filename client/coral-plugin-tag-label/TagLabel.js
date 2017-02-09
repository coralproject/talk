import React, {Component} from 'react';
const packagename = 'coral-plugin-tag-label';
import styles from './styles.css';

export default class TagLabel extends Component {

  render () {
    const {tags} = this.props;
    console.log('DEBUG ', tags);
    return (
      <div
        className={`${packagename}-text`}
        className={`${styles.tagLabel}`}>
        {tags && tags}
      </div>
    );
  }
}
