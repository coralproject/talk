import React from 'react';
import cn from 'classnames';
import styles from './ShareButton.css';
import { t } from 'plugin-api/beta/client/services';
import { ClickOutside } from 'plugin-api/beta/client/components';
import { Icon, Button } from 'plugin-api/beta/client/components/ui';

import {
    FacebookShareButton,
    TwitterShareButton,

    FacebookIcon,
    TwitterIcon,
} from 'react-share';

const name = 'talk-plugin-social-share';


export default class ShareButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false
        };
    }

    toggle = () => {
        this.popover.style.top = `${this.linkButton.offsetTop - 80}px`;

        this.setState({
            popoverOpen: !this.state.popoverOpen,
        });
    };

    handleClickOutside = () => {
        if (this.state.popoverOpen) {
            this.setState({
                popoverOpen: false,
            });
        }
    };

    render() {
        const { popoverOpen } = this.state;
        const { asset, comment } = this.props;
        const shareUrl = asset.url + "?commentId=" + comment.id;
        const title = t('talk-plugin-social-share.share_title');

        return (
            <ClickOutside onClickOutside={this.handleClickOutside}>
                <div className={cn(`${name}-container`, styles.container)}>
                    <button
                        ref={ref => (this.linkButton = ref)}
                        onClick={this.toggle}
                        className={cn(`${name}-button`, styles.button)}
                    >
                            <span className={`${name}-button-label`}>
                                {t('talk-plugin-social-share.share')}
                            </span>
                            <Icon name="share" className={styles.icon} />
                    </button>

                    <div
                        ref={ref => (this.popover = ref)}
                        className={cn([
                        `${name}-popover`,
                        styles.popover,
                        { [styles.active]: popoverOpen },
                        ])}
                    >
                        <h3 className={styles.title}>
                            {t('talk-plugin-social-share.title')}
                        </h3>         

                        <FacebookShareButton
                            url={shareUrl}
                            quote={title}
                            className={styles.item}
                        >
                            <FacebookIcon
                                size={32}
                                round />
                        </FacebookShareButton>  

                        <TwitterShareButton
                            url={shareUrl}
                            title={title}
                            className={styles.item}
                        >
                            <TwitterIcon
                                size={32}
                                round />
                        </TwitterShareButton>                       
                    </div>
                </div>
            </ClickOutside>
        );
    }
}
