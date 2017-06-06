import React from 'react';
import cn from 'classnames';
import {Icon} from 'coral-ui';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styles from './ViewingOptions.css';
import Slot from 'coral-framework/components/Slot';
import {openViewingOptions, closeViewingOptions} from 'coral-embed-stream/src/actions/stream';

const ViewingOptions = (props) => {
  const toggleOpen = () => {
    if (!props.open) {
      props.openViewingOptions();
    } else {
      props.closeViewingOptions();
    }
  };

  return (
    <div className={cn([styles.viewingOptions, 'streamViewingOptions'])}>
      <div>
        <a onClick={toggleOpen}>Viewing Options
          {props.open ? <Icon name="arrow_drop_up"/> : <Icon name="arrow_drop_down"/>}
        </a>
      </div>
      {
        props.open ? (
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
};

const mapStateToProps = ({stream}) => ({open: stream.viewingOption.open});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({openViewingOptions, closeViewingOptions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ViewingOptions);
