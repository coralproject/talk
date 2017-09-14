import LinkifyIt from 'linkify-it';
import tlds from 'tlds';

export function createLinkify() {
  const linkify = new LinkifyIt();
  linkify.tlds(tlds);
  return linkify;
}
