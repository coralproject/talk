import React from 'react';
import QuestionBox from '../../../components/QuestionBox';
import { Icon, Spinner } from 'coral-ui';
import DefaultQuestionBoxIcon from '../../../components/DefaultQuestionBoxIcon';
import cn from 'classnames';
import styles from './QuestionBoxBuilder.css';

const DefaultIcon = <DefaultQuestionBoxIcon className={styles.defaultIcon} />;

const icons = [{ default: DefaultIcon }, 'forum', 'build', 'format_quote'];

class QuestionBoxBuilder extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
    };
  }

  componentWillMount() {
    this.loadEditor();
  }

  async loadEditor() {
    const {
      default: MarkdownEditor,
    } = await import('coral-framework/components/MarkdownEditor');

    return this.setState({
      loading: false,
      MarkdownEditor,
    });
  }

  render() {
    const {
      questionBoxIcon,
      questionBoxContent,
      onContentChange,
      onIconChange,
    } = this.props;
    const { loading, MarkdownEditor } = this.state;

    if (loading) {
      return <Spinner />;
    }

    return (
      <div className={styles.root}>
        <h4>Include an Icon</h4>

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

export default QuestionBoxBuilder;
