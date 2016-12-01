import React, {Component} from 'react';
import Bio from '../components/Bio';

export default class BioContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      bio: props.bio
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleInput(e) {
    this.setState({
      bio: e.target.value
    });
  }

  handleSave (e) {
    e.preventDefault();
    const {userData, saveBio} = this.props;
    const {bio} = this.state;
    saveBio(userData.id, {bio});
  }

  handleCancel () {
    this.setState({
      bio: this.props.bio
    });
  }

  render () {
    return <Bio
      bio={this.state.bio}
      userData={this.props.userData}
      handleSave={this.handleSave}
      handleInput={this.handleInput}
      handleCancel={this.handleCancel}
    />;
  }
}
