import React, {Component} from 'react';
import Bio from '../components/Bio';

export default class BioContainer extends Component {
  constructor (props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(input) {
    this.bioInput = input;
  }

  handleSave (e) {
    e.preventDefault();
    const {userData, saveBio} = this.props;
    saveBio(userData.id, {
      bio: this.bioInput.value
    });
  }

  render () {
    return <Bio
      bio={this.props.bio}
      userData={this.props.userData}
      handleSave={this.handleSave}
      handleInput={this.handleInput}
    />;
  }
}
