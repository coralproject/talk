import { once } from "lodash";

/**
 * CSSAsset represents a loadable CSS Asset whose
 * `onLoad` property is only called once.
 */
export default class CSSAsset {
  private _href: string;
  private _onLoad?: React.ReactEventHandler<HTMLLinkElement>;

  constructor(href: string, onLoad?: React.ReactEventHandler<HTMLLinkElement>) {
    this._href = href;
    // Make sure onLoad is ever only called once.
    this._onLoad = onLoad && once(onLoad);
  }

  public get href() {
    return this._href;
  }
  public get onLoad() {
    return this._onLoad;
  }
}
