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
    const value = await this.context.pymSessionStorage.getItem(this.getPath());
    if (value && this.props.onChange) {
      this.props.onChange(value);
    }
  }

  getPath = () => {
    return `${STORAGE_PATH}_${this.props.id}`;
  };

  onChange = (body, data) => {
    this.props.onChange && this.props.onChange(body, data);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      if (nextProps.value) {
        this.context.pymSessionStorage.setItem(this.getPath(), nextProps.value);
      } else {
        this.context.pymSessionStorage.removeItem(this.getPath());
      }
    }
  }

  render() {
    const queryData = { comment: this.props.comment, root: this.props.root };

    return (
      <DraftArea
        queryData={queryData}
        value={this.props.value}
        placeholder={this.props.placeholder}
        id={this.props.id}
        onChange={this.onChange}
        rows={this.props.rows}
        disabled={this.props.disabled}
        charCountEnable={this.props.charCountEnable}
        maxCharCount={this.props.maxCharCount}
        label={this.props.label}
        registerHook={this.props.registerHook}
        unregisterHook={this.props.unregisterHook}
        isReply={this.props.isReply}
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
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  label: PropTypes.string.isRequired,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object,
};

const slots = ['draftArea'];

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
