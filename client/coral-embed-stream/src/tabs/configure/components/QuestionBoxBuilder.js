import React from 'react';
import QuestionBox from '../../../components/QuestionBox';
import DefaultQuestionBoxIcon from '../../../components/DefaultQuestionBoxIcon';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './QuestionBoxBuilder.css';
import { Icon } from 'coral-ui';
import MarkdownEditor from 'coral-framework/components/MarkdownEditor';

const DefaultIcon = <DefaultQuestionBoxIcon className={styles.defaultIcon} />;
const icons = [{ default: DefaultIcon }, 'forum', 'build', 'format_quote'];

class QuestionBoxBuilder extends React.Component {
  render() {
    const {
      title,
      questionBoxIcon,
      questionBoxContent,
      onContentChange,
      onIconChange,
    } = this.props;

    return (
      <div className={styles.root}>
        <h4>{title}</h4>

        <ul className={styles.iconList}>
          {icons.map(item => {
            const name = typeof item === 'object' ? Object.keys(item)[0] : item;
            const icon = typeof item === 'object' ? item[name] : item;
            return (
              <li className={styles.item} key={name}>
                <button
                  className={cn(styles.button, {
                    [styles.buttonActive]: questionBoxIcon === name,
                  })}
                  onClick={() => onIconChange(name)}
                >
                  {typeof icon === 'string' ? <Icon name={icon} /> : icon}
                </button>
              </li>
            );
          })}
        </ul>

        <QuestionBox
          className={styles.questionBox}
          icon={questionBoxIcon}
          content={questionBoxContent}
        />

        <MarkdownEditor value={questionBoxContent} onChange={onContentChange} />
      </div>
    );
  }
}

QuestionBoxBuilder.propTypes = {
  title: PropTypes.string,
  questionBoxIcon: PropTypes.string,
  questionBoxContent: PropTypes.string,
  onContentChange: PropTypes.func,
  onIconChange: PropTypes.func,
};

export default QuestionBoxBuilder;
