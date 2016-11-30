import React, {Component} from 'react';
import Bio from '../components/Bio';

export default class BioContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      bio: ''
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
  }

  handleBioChange(e) {
    this.setState({
      bio: e.target.value
    });
  }

  handleSave () {
    // const {bio} = this.state;
    // this.props.saveBio(user_id, bio);
  }

  render () {
    return <Bio
      handleSave={this.handleSave}
      handleChange={this.handleChange}
      {...this.props}
      {...this.state}
    />;
  }
}
