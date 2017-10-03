import React from 'react';
import QuestionBox from 'talk-plugin-questionbox/QuestionBox';
import {Icon, Spinner} from 'coral-ui';
import DefaultIcon from './DefaultIcon';
import cn from 'classnames';
import styles from './QuestionBoxBuilder.css';

class QuestionBoxBuilder extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true
    };
  }

  componentWillMount() {
    this.loadEditor();
  }

  async loadEditor() {
    const {default: MarkdownEditor} = await import('coral-framework/components/MarkdownEditor');

    return this.setState({
      loading : false,
      MarkdownEditor
    });
  }

  render() {
    const {handleChange, questionBoxIcon, questionBoxContent} = this.props;
    const {loading, MarkdownEditor} = this.state;

    if (loading) {
      return <Spinner/>;
    }

    return (
      <div className={styles.qbBuilder}>
        <h4>Include an Icon</h4>

        <ul className={styles.qbItemIconList}>
          <li className={cn(
            styles.qbItemIcon,
            {[styles.qbItemIconActive]: questionBoxIcon === 'default'}
          )}
          id="qboxicon"
          onClick={handleChange}
          data-icon="default" >
            <DefaultIcon className={styles.defaultIcon} />
          </li>
          <li className={cn(
            styles.qbItemIcon,
            {[styles.qbItemIconActive]: questionBoxIcon === 'forum'}
          )}
          id="qboxicon"
          onClick={handleChange}
          data-icon="forum" >
            <Icon name="forum" />
          </li>
          <li className={cn(
            styles.qbItemIcon,
            {[styles.qbItemIconActive]: questionBoxIcon === 'build'}
          )}
          id="qboxicon"
          onClick={handleChange}
          data-icon="build" >
            <Icon name="build" />
          </li>
          <li className={cn(
            styles.qbItemIcon,
            {[styles.qbItemIconActive]: questionBoxIcon === 'format_quote'}
          )}
          id="qboxicon"
          onClick={handleChange}
          data-icon="format_quote" >
            <Icon name="format_quote" />
          </li>
        </ul>

        <QuestionBox
          className={styles.qb}
          enable={true}
          icon={questionBoxIcon}
          content={questionBoxContent}
        />

        <MarkdownEditor
          value={questionBoxContent}
          onChange={(value) => handleChange({}, {questionBoxContent: value})}
        />

      </div>
    );
  }
}

export default QuestionBoxBuilder;
