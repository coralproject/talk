
import React from 'react';
import styles from './CommentBox.css';
import {Button} from 'react-mdl';

// Renders a comment box for creating a new comment
export default class CommentBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {name: '', body: ''};
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit () {
    const {name, body} = this.state;
    this.props.onSubmit({name, body});
    this.setState({body: '', name: ''});
  }

  render (props, {name, body}) {
    return (
      <div>
        <div class={`${styles.textareaContainer} mdl-textfield mdl-js-textfield`}>
          <input type='text' value={name} onInput={this.linkState('name')} class='mdl-textfield__input' id='name' />
          <label class='mdl-textfield__label' for='name'>Your name</label>
        </div>
        <div class={`${styles.textareaContainer} mdl-textfield mdl-js-textfield`}>
          <textarea value={body} onInput={this.linkState('body')} class='mdl-textfield__input' type='text' rows='5' id='comment' />
          <label class='mdl-textfield__label' for='comment'>Write your comment</label>
        </div>
        <Button onClick={this.onSubmit} raised>Post</Button>
      </div>
    );
  }
}
