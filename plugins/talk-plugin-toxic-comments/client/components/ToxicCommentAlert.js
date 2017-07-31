import React from 'react';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {isTagged} from 'plugin-api/beta/client/utils';

export default class ToxicCommentAlert extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toxic: false
    };
  }

  componentDidMount() {
    this.toxicityHook = this.props.registerHook('preSubmit', (data) => {
      const comment = data.body;
      (async() => {
        var toxicity = await fetch('/api/v1/toxicity/score', {
          method: 'POST',
          body: comment
        })
        .then(response => response.json())
        .then(function(json) {
          return json.score;
        })
        .catch(function(err) {
          console.log(err);
          return 0;
        });
        console.log(toxicity);
        if(toxicity > 0.3){
          this.setState({
            toxic: true
          });
        }
        else {
          this.setState({
            toxic: false
          });
        }
      })();
    });
  }

  componentWillUnmount() {
    this.props.unregisterHook(this.toxicityHook);
  }

  render() {
    return(
      <div className={styles.toxicComment}>
      {
        this.state.toxic ? (
          <span> Are you sure you want to post this? Other members of the community my view your comment as toxic, so please take a moment to reconsider.</span>
        ) : null
      }
      </div>
    );
  }

}
