import { once } from "lodash";

/**
 * CSSAsset represents a loadable CSS Asset whose
 * `onLoad` property is only called once.
 */
export default class CSSAsset {
  private _href: string;
  private _onLoad?: React.ReactEventHandler<HTMLLinkElement>;
  private _onError?: React.ReactEventHandler<HTMLLinkElement>;

  constructor(
    href: string,
    onLoad?: React.ReactEventHandler<HTMLLinkElement>,
    onError?: (href: string) => void
  ) {
    this._href = href;
    // Make sure event handlers are ever only called once.
    this._onLoad = onLoad && once(onLoad);
    this._onError = onError && once(() => onError(href));
  }

  public get href() {
    return this._href;
  }
  public get onLoad() {
    return this._onLoad;
  }
  public get onError() {
    return this._onError;
  }
}
