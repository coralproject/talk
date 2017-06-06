import React from 'react';
import cn from 'classnames';
import styles from './ViewingOptions.css';
import Slot from 'coral-framework/components/Slot';

export default class ViewingOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  toggleOpen = () => {
    this.setState((state) => ({
      open: !state.open
    }));
  }

  render() {
    return (
      <div className={cn([styles.viewingOptions, 'streamViewingOptions'])}>
        <div>
          <a onClick={this.toggleOpen}>Viewing Options</a>
        </div>
        {
          true ? (
            <div className={cn([styles.streamViewingOptionsList, 'streamViewingOptionsList'])}>
              <ul>
                {
                  React.Children.map(<Slot fill="streamViewingOptions" />, (component) => {
                    return React.createElement('li', {
                      className: 'viewingOption'
                    }, component);
                  })
                }
              </ul>
            </div>
          ) : null
        }
      </div>
    );
  }
}
