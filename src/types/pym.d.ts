declare module "pym.js" {
  export type MessageCallback = (message: string) => void;

  export interface ChildSettings {
    /**
     * Callback invoked after receiving a resize event from the parent,
     * sets module:pym.Child#settings.renderCallback
     */
    renderCallback?: Function;
    /** xdomain to validate messages received */
    xdomain?: string;
    /** polling frequency in milliseconds to send height to parent */
    polling?: number;
    /**
     * parent container id used when navigating the child
     * iframe to a new page but we want to keep it responsive.
     */
    id?: string;
    /**
     * if passed it will be override the default parentUrl query string
     * parameter name expected on the iframe src
     */
    parenturlparam?: string;
  }

  /** The Child half of a responsive iframe.  */
  export class Child {
    /** The id of the parent container */
    id: string;

    /** The timerId in order to be able to stop when polling is enabled */
    timerId: string;

    /** The initial width of the parent page */
    parentWidth: string;

    /** The URL of the parent page from window.location.href. */
    parentUrl: string;

    /** The title of the parent page from document.title. */
    parentTitle: string;

    /** Stores the registered messageHandlers for each messageType */
    messageHandlers: Record<string, Array<MessageCallback>>;

    /** RegularExpression to validate the received messages */
    messageRegex: RegExp;

    constructor(config: ChildSettings);

    /** Navigate parent to a given url. */
    navigateParentTo(url: string): void;

    /**
     * Bind a callback to a given messageType from the child.
     * Reserved message names are: "width".
     */
    onMessage(messageType: string, callback: (message: string) => void): void;

    /** Unbind child event handlers and timers. */
    remove(): void;

    /** Scroll parent to a given element id. */
    scrollParentTo(hash: string): void;

    /** Scroll parent to a given child element id. */
    scrollParentToChildEl(id: string): void;

    /** Scroll parent to a particular child offset. */
    scrollParentToChildPos(pos: number): void;

    /** Transmit the current iframe height to the parent. */
    sendHeight(): void;

    /** Send a message to the the Parent. */
    sendMessage(messageType: string, message: string): void;
  }

  export interface ParentSettings {
    /** xdomain to validate messages received */
    xdomain?: string;
    /** if passed it will be assigned to the iframe title attribute */
    title?: string;
    /** if passed it will be assigned to the iframe name attribute */
    name?: string;
    /** if passed it will be assigned to the iframe id attribute */
    id?: string;

    /** if passed it will be assigned to the iframe allowfullscreen attribute */
    allowfullscreen?: boolean;

    /**
     * if passed it will be assigned to the iframe sandbox attribute
     * (we do not validate the syntax so be careful!!)
     */
    sandbox?: string;

    /**
     * if passed it will be override the default parentUrl query string
     * parameter name passed to the iframe src
     */
    parenturlparam?: string;
    /**
     * if passed it will be override the default parentUrl query string
     * parameter value passed to the iframe src
     */
    parenturlvalue?: string;
    /**
     * if passed and different than false it will strip the querystring
     * params parentUrl and parentTitle passed to the iframe src
     */
    optionalparams?: boolean;

    /** if passed it will activate scroll tracking on the parent */
    trackscroll?: boolean;
    /**
     * if passed it will set the throttle wait in order to fire
     * scroll messaging. Defaults to 100 ms.
     */
    scrollwait?: number;
  }

  /** The Parent half of a response iframe. */
  export class Parent {
    /** The container DOM object */
    el: HTMLElement;

    /** The id of the container element */
    id: string;

    /** The contained child iframe */
    iframe: HTMLElement;

    /** Stores the registered messageHandlers for each messageType */
    messageHandlers: Record<string, Array<(message: string) => void>>;

    /** RegularExpression to validate the received messages */
    messageRegex: RegExp;

    /**
     * The parent instance settings, updated by the values
     * passed in the config object
     */
    settings: ParentSettings;

    /** The url that will be set as the iframe's src */
    url: string;

    constructor(id: string, url: string, config: ParentSettings);

    /**
     * Bind a callback to a given messageType from the child.
     * Reserved message names are: "height", "scrollTo" and "navigateTo".
     */
    onMessage(messageType: string, callback: (message: string) => void): void;

    /** Remove this parent from the page and unbind it's event handlers. */
    remove(): void;

    /** Send a message to the the child. */
    sendMessage(messageType: string, message: string): void;

    /**
     * Transmit the current viewport and iframe position to the child.
     * Sends viewport width, viewport height
     * and iframe bounding rect top-left-bottom-right
     * all separated by spaces
     *
     * You shouldn't need to call this directly.
     */
    sendViewportAndIFramePosition(): void;

    /**
     * Transmit the current iframe width to the child.
     * You shouldn't need to call this directly.
     */
    sendWidth(): void;
  }
  export function autoInit(doNotRaiseEvents: boolean): void;
}
