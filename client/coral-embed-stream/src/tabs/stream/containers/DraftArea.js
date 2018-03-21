import React from 'react';
import { gql } from 'react-apollo';
import { getSlotFragmentSpreads } from 'coral-framework/utils';
import PropTypes from 'prop-types';
import DraftArea from '../components/DraftArea';
import withFragments from 'coral-framework/hocs/withFragments';

const STORAGE_PATH = 'DraftArea';

/**
 * An enhanced textarea to make comment drafts.
 */
class DraftAreaContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.initValue();
  }

  async initValue() {
    const input = await this.context.pymSessionStorage.getItem(this.getPath());
    if (input && this.props.onInputChange) {
      let parsed = '';

      // Older version saved a normal string, catch those and ignore them.
      try {
        parsed = JSON.parse(input);
      } catch (_e) {}
      if (typeof parsed === 'object') {
        this.props.onInputChange(parsed);
      }
    }
  }

  getPath = () => {
    return `${STORAGE_PATH}_${this.props.id}`;
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.input !== nextProps.input) {
      if (nextProps.input) {
        this.context.pymSessionStorage.setItem(
          this.getPath(),
          JSON.stringify(nextProps.input)
        );
      } else {
        this.context.pymSessionStorage.removeItem(this.getPath());
      }
    }
  }

  render() {
    return (
      <DraftArea
        root={this.props.root}
        comment={this.props.comment}
        input={this.props.input}
        id={this.props.id}
        onInputChange={this.props.onInputChange}
        disabled={this.props.disabled}
        charCountEnable={this.props.charCountEnable}
        maxCharCount={this.props.maxCharCount}
        registerHook={this.props.registerHook}
        unregisterHook={this.props.unregisterHook}
        isReply={this.props.isReply}
        isEdit={this.props.isEdit}
      />
    );
  }
}

DraftAreaContainer.contextTypes = {
  // We use pymSessionStorage instead to persist the data directly on the parent page,
  // in order to mitigate strict cross domain security settings.
  pymSessionStorage: PropTypes.object,
};

DraftAreaContainer.propTypes = {
  charCountEnable: PropTypes.bool,
  maxCharCount: PropTypes.number,
  id: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
  isEdit: PropTypes.bool,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object,
};

const slots = ['draftArea', 'commentInputArea'];

export default withFragments({
  root: gql`
    fragment TalkEmbedStream_DraftArea_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }
  `,
  comment: gql`
    fragment TalkEmbedStream_DraftArea_comment on Comment {
      __typename
      ${getSlotFragmentSpreads(slots, 'comment')}
    }
  `,
})(DraftAreaContainer);
