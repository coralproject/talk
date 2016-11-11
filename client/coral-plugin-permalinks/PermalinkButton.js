import React, {PropTypes} from 'react';
import onClickOutside from 'react-onclickoutside';
const name = 'coral-plugin-permalinks';

class PermalinkButton extends React.Component {

  static propTypes = {
    asset_id: PropTypes.string.isRequired,
    comment_id: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {popoverOpen: false, copySuccessful: null, copyFailure: null};
    this.toggle = this.toggle.bind(this);
    this.copyPermalink = this.copyPermalink.bind(this);
  }

  toggle () {
    this.setState({popoverOpen: !this.state.popoverOpen});
  }

  handleClickOutside () {
    this.setState({popoverOpen: false});
  }

  copyPermalink () {
    this.permalinkInput.select();
    try {
      document.execCommand('copy');
      this.setState({copySuccessful: true});
    } catch (err) {
      this.setState({copyFailure: true});
    }

    setTimeout(() => {
      this.setState({copyFailure: null, copySuccessful: null});
    }, 4500);
  }

  render () {
    const publisherUrl = 'http://nytimes.com/';

    return (
      <div className={`${name}-container`} style={styles}>
        <button onClick={this.toggle} className={`${name}-button`}>
          <i className={`${name}-icon material-icons`} aria-hidden={true}>link</i>
          Permalink
        </button>
        <div
          style={styles.popover(this.state.popoverOpen)}
          className={`${name}-popover`}>
          <input
            type='text'
            ref={input => this.permalinkInput = input}
            value={`${publisherUrl}${this.props.asset_id}#${this.props.comment_id}`}
            onChange={() => {}} />
          <button className={`${name}-copy-button`} onClick={this.copyPermalink}>Copy</button>
          {
            this.state.copySuccessful ? <p>copied to clipboard</p> : null
          }
          {
            this.state.copyFailure
            ? <p>copying to clipboard not supported in this browser. Use Cmd + C.</p>
            : null
          }
        </div>
      </div>
    );
  }
}

export default onClickOutside(PermalinkButton);

const styles = {
  position: 'relative',

  popover: active => {
    return {
      display: active ? 'block' : 'none',
      backgroundColor: 'white',
      border: '1px solid black',
      minWidth: 400,
      position: 'absolute',
      top: 30,
      right: 0,
      padding: 5
    };
  }
};
